# Start the PixelArt-Painter API and open the local frontend.
param(
    [string]$RepoRoot = "",
    [string]$SettingsFile = "",
    [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $RepoRoot) { $RepoRoot = (Resolve-Path (Join-Path $scriptDir "..")).Path }
if (-not $SettingsFile) { $SettingsFile = Join-Path $scriptDir "dev-settings.json" }

$settings = Get-Content $SettingsFile -Raw | ConvertFrom-Json
$appDir = Join-Path $RepoRoot "app"
$indexPath = Join-Path $RepoRoot "index.html"
$port = [int]$settings.apiPort

if (-not (Test-Path (Join-Path $appDir "node_modules"))) {
    throw "Run setup-dev.bat first (npm dependencies are missing)."
}

if ($settings.linkInWampWww) {
    $openUrl = "http://localhost/$($settings.wwwSubfolder)/"
}
else {
    $openUrl = "file:///$($indexPath.Replace('\', '/'))"
}

Write-Host "Starting API on http://localhost:$port ..."
Write-Host "Press Ctrl+C in this window to stop the server.`n"

if (-not $NoBrowser) {
    Start-Process $openUrl
}

Push-Location $appDir
try {
    $env:PORT = "$port"
    node index.js
}
finally {
    Pop-Location
}
