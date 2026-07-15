# One-time local dev setup for PixelArt-Painter (does not touch your other www sites).
param(
    [string]$RepoRoot = "",
    [string]$SettingsFile = "",
    [switch]$LinkInWampWww,
    [switch]$SkipDatabase,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

function Write-Step([string]$Message) {
    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Find-MySqlClient([string]$WampRoot) {
    $candidates = @()
    if ($WampRoot -and (Test-Path $WampRoot)) {
        $candidates += Get-ChildItem -Path (Join-Path $WampRoot "bin\mysql") -Recurse -Filter "mysql.exe" -ErrorAction SilentlyContinue
        $candidates += Get-ChildItem -Path (Join-Path $WampRoot "bin\mariadb") -Recurse -Filter "mysql.exe" -ErrorAction SilentlyContinue
        $candidates += Get-ChildItem -Path (Join-Path $WampRoot "bin\mariadb") -Recurse -Filter "mariadb.exe" -ErrorAction SilentlyContinue
    }
  $fromPath = Get-Command mysql -ErrorAction SilentlyContinue
    if ($fromPath) { return $fromPath.Source }
    if ($candidates.Count -gt 0) { return ($candidates | Select-Object -First 1).FullName }
    return $null
}

function Backup-FileIfNeeded([string]$Path) {
    if (-not (Test-Path $Path)) { return }
    $backup = "$Path.bak"
    if ((Test-Path $backup) -and -not $Force) { return }
    Copy-Item -Path $Path -Destination $backup -Force
    Write-Host "Backed up $Path -> $backup"
}

function Set-LocalApiUrl([string]$IndexPath, [int]$Port) {
    $localApi = "http://localhost:$Port/api/"
    $prodApi = "https://pixelart.nolliergb.com/api/"
    $content = Get-Content -Path $IndexPath -Raw -Encoding UTF8
    Backup-FileIfNeeded $IndexPath

    $devBlock = "(?m)^(\s*)//const api = 'http://localhost:\d+/api/';\r?\n\1const api = 'https://pixelart\.nolliergb\.com/api/';"
    $devReplacement = "`$1const api = '$localApi';`r`n`$1//const api = '$prodApi';"
    $activeLocal = "(?m)^(\s*)const api = 'http://localhost:\d+/api/';"
    $activeProd = "(?m)^(\s*)const api = 'https://pixelart\.nolliergb\.com/api/';"

    if ($content -match $devBlock) {
        $content = $content -replace $devBlock, $devReplacement
    }
    elseif ($content -match $activeLocal) {
        $content = $content -replace $activeLocal, "`$1const api = '$localApi';"
    }
    elseif ($content -match $activeProd) {
        $content = $content -replace $activeProd, "`$1const api = '$localApi';`r`n`$1//const api = '$prodApi';"
    }
    else {
        throw "Could not find the api URL line in index.html. Edit it manually to: const api = '$localApi';"
    }

    if ($content -notmatch [regex]::Escape("const api = '$localApi';")) {
        throw "Failed to update index.html API URL."
    }

    [System.IO.File]::WriteAllText($IndexPath, $content)
    Write-Host "index.html now points at $localApi"
}

function Write-AppConfig([string]$ConfigPath, [hashtable]$Db) {
    Backup-FileIfNeeded $ConfigPath
    $json = [ordered]@{
        host     = $Db.Host
        user     = $Db.User
        password = $Db.Password
        database = $Db.Name
    } | ConvertTo-Json
    Set-Content -Path $ConfigPath -Value $json -Encoding UTF8
    Write-Host "Wrote $ConfigPath for database '$($Db.Name)' on $($Db.Host)"
}

function Ensure-WampLink([string]$WampRoot, [string]$Subfolder, [string]$Target) {
    $linkPath = Join-Path (Join-Path $WampRoot "www") $Subfolder
    if (Test-Path $linkPath) {
        $item = Get-Item $linkPath -Force
        if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
            Write-Host "WAMP link already exists: $linkPath"
            return $linkPath
        }
        throw "www\$Subfolder already exists and is not a junction. Pick another name in scripts\dev-settings.json."
    }

    New-Item -ItemType Junction -Path $linkPath -Target $Target | Out-Null
    Write-Host "Created junction: $linkPath -> $Target"
    return $linkPath
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $RepoRoot) { $RepoRoot = (Resolve-Path (Join-Path $scriptDir "..")).Path }
if (-not $SettingsFile) { $SettingsFile = Join-Path $scriptDir "dev-settings.json" }

if (-not (Test-Path $SettingsFile)) {
    throw "Missing settings file: $SettingsFile"
}

$settings = Get-Content $SettingsFile -Raw | ConvertFrom-Json
if ($LinkInWampWww) { $settings.linkInWampWww = $true }

$sqlFile = Join-Path $RepoRoot "nollie_nodejs.sql"
$appDir = Join-Path $RepoRoot "app"
$configPath = Join-Path $appDir "config.json"
$indexPath = Join-Path $RepoRoot "index.html"

Write-Step "Checking prerequisites"
if (-not (Test-Path $sqlFile)) { throw "Missing SQL dump: $sqlFile" }
if (-not (Test-Path $indexPath)) { throw "Missing index.html in $RepoRoot" }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw "Node.js is not installed or not on PATH." }
if (-not (Test-Path $appDir)) { throw "Missing app folder: $appDir" }

$mysqlExe = Find-MySqlClient $settings.wampRoot
if (-not $SkipDatabase -and -not $mysqlExe) {
    throw @"
Could not find mysql.exe.
- Start WAMP and ensure MySQL/MariaDB is installed.
- Or add mysql to PATH.
- Or rerun with -SkipDatabase if the DB is already imported.
"@
}

Write-Step "Installing Node dependencies"
Push-Location $appDir
try {
    npm install
}
finally {
    Pop-Location
}

if (-not $SkipDatabase) {
    Write-Step "Creating dev database '$($settings.database)'"
    $mysqlArgs = @("-h", $settings.dbHost, "-u", $settings.dbUser)
    if ($settings.dbPassword) { $mysqlArgs += @("-p$($settings.dbPassword)") }

    $createDbSql = "CREATE DATABASE IF NOT EXISTS ``$($settings.database)`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    & $mysqlExe @mysqlArgs -e $createDbSql
    if ($LASTEXITCODE -ne 0) { throw "Failed to create database. Check WAMP MySQL is running and scripts\dev-settings.json credentials." }

    Write-Step "Importing nollie_nodejs.sql (first run can take a minute)"
    Get-Content $sqlFile -Raw | & $mysqlExe @mysqlArgs $settings.database
    if ($LASTEXITCODE -ne 0) { throw "SQL import failed." }
}

Write-Step "Writing local app config"
Write-AppConfig $configPath @{
    Host     = $settings.dbHost
    User     = $settings.dbUser
    Password = $settings.dbPassword
    Name     = $settings.database
}

Write-Step "Pointing frontend at local API"
Set-LocalApiUrl $indexPath ([int]$settings.apiPort)

$openUrl = "file:///$($indexPath.Replace('\', '/'))"
if ($settings.linkInWampWww) {
    if (-not (Test-Path $settings.wampRoot)) { throw "WAMP root not found: $($settings.wampRoot)" }
    $linkPath = Ensure-WampLink $settings.wampRoot $settings.wwwSubfolder $RepoRoot
    $openUrl = "http://localhost/$($settings.wwwSubfolder)/"
}

Write-Step "Done"
Write-Host @"

Local dev is ready.

1. Start WAMP (MySQL only is enough).
2. Run start-dev.bat from the project folder.
3. Open: $openUrl

Your other sites under $($settings.wampRoot)\www are untouched.
Dev DB name: $($settings.database) (separate from production data).

Edit scripts\dev-settings.json if you need a MySQL password or a different DB name.
"@
