const langDB = {
    home: { en: '<span class="mdi mdi-home-outline"></span> Home', zh: '<span class="mdi mdi-home-outline"></span> 首页' },
    language: { en: '<span class="mdi mdi-translate"></span> Language', zh: '<span class="mdi mdi-translate"></span> 语言' },
    installAddon: { en: '<span class="mdi mdi-tools"></span> Install Pixel Art Addon', zh: '<span class="mdi mdi-tools"></span> 安装像素屏插件' },
    header: { en: "SignalRGB WLED/Nollie1 Matrix Pixel Art Painter", zh: "SignalRGB WLED/Nollie1 像素屏画家" },
    size: { en: '<span class="mdi mdi-image-size-select-small"></span> Size', zh: '<span class="mdi mdi-image-size-select-small"></span> 大小' },
    import: { en: '<span class="mdi mdi-import"></span> Import', zh: '<span class="mdi mdi-import"></span> 导入' },
    export: { en: '<span class="mdi mdi-export"></span> Export', zh: '<span class="mdi mdi-export"></span> 导出' },
    draw: { en: '<span class="mdi mdi-draw"></span> Draw', zh: '<span class="mdi mdi-draw"></span> 绘画模式' },
    fill: { en: '<span class="mdi mdi-format-color-fill"></span> Fill', zh: '<span class="mdi mdi-format-color-fill"></span> 填充模式' },
    erase: { en: '<span class="mdi mdi-eraser"></span> Erase', zh: '<span class="mdi mdi-eraser"></span> 擦除模式' },
    clear: { en: '<span class="mdi mdi-trash-can-outline"></span> Clear All', zh: '<span class="mdi mdi-trash-can-outline"></span> 清除全部' },
    invert: { en: '<span class="mdi mdi-invert-colors"></span> Invert', zh: '<span class="mdi mdi-invert-colors"></span> 反转' },
    mirrorHorizontal: { en: '<span class="mdi mdi-flip-horizontal"></span> Mirror Horizontal', zh: '<span class="mdi mdi-flip-horizontal"></span> 水平镜像' },
    mirrorVertical: { en: '<span class="mdi mdi-flip-vertical"></span> Mirror Vertical', zh: '<span class="mdi mdi-flip-vertical"></span> 垂直镜像' },
    flipHorizontal: { en: '<span class="mdi mdi-horizontal-rotate-clockwise"></span> Flip Horizontal', zh: '<span class="mdi mdi-horizontal-rotate-clockwise"></span> 水平翻转' },
    flipVertical: { en: '<span class="mdi mdi-axis-z-rotate-clockwise"></span> Flip Vertical' , zh: '<span class="mdi mdi-axis-z-rotate-clockwise"></span> 垂直翻转' },
    position1: { en: 'Position: (-1, -1)', zh: '位置: (-1, -1)' },
    cellsize1: { en: 'Cell Size: 0x0', zh: '像元大小: 34x34' },
    position2: { en: 'Position:', zh: '位置:' },
    cellsize2: { en: 'Cell Size:', zh: '像元大小:' },
    copycode: { en: 'Copy the code below into SignalRGB', zh: '将以下代码复制到SignalRGB' },
    copy: { en: 'Copy', zh: '复制' },
    ok: { en: 'OK', zh: '确认' },
    copied: { en: 'Code copied to clipboard.', zh: '代码已复制到剪贴板。' },
    load: { en: '<span class="mdi mdi-cloud-outline"></span> Load', zh: '<span class="mdi mdi-cloud-outline"></span> 载入' },
    save: { en: '<span class="mdi mdi-content-save-outline"></span> Save', zh: '<span class="mdi mdi-content-save-outline"></span> 保存' },
    saveTitle: { en: 'Save pixel art', zh: '保存像素屏' },
    saveSubtitle: { en: 'What would you like to call this pixel art?', zh: '您想将这个像素艺术存档命名为什么？' },
    submit: { en: 'Submit', zh: '提交' },
    loadTitle: { en: 'Load pixel art', zh: '载入像素屏' },
    loadSubtitle: { en: 'Which pixel art would you like load?', zh: '您想要加载哪一个像素存档？' },
    saved: { en: 'Pixel art saved.', zh: '像素存档保存成功。' },
    remove: { en: 'Remove', zh: '删除' },
    update: { en: 'Update', zh: '更新' },
    edit: { en: 'Edit', zh: '修改' },
    pleaseSelect: { en: 'Please select...', zh: '请选择...' },
    errorParsingJson: { en: 'Error parsing JSON data.', zh: '解析 JSON 数据时出错。' },
    oops: { en: 'Oops...', zh: '卧艹...' },
    community: { en: '<span class="mdi mdi-account-group-outline"></span> Community Pixel Art', zh: '<span class="mdi mdi-account-group-outline"></span> 社区像素作品' },
    share: { en: '<span class="mdi mdi-share-variant-outline"></span> Share', zh: '<span class="mdi mdi-share-variant-outline"></span> 分享' },
    shareTitle: { en: 'Share pixel art', zh: '分享作品' },
    shareAuthor: { en: 'Who are you?', zh: '你是谁？' },
    shared: { en: 'The pixel artwork has been shared successfully.', zh: '像素作品已成功分享。' },
    communityTitle: { en: 'Browse Community Pixel Art', zh: '浏览社区像素作品' },
    search: { en: 'Search...', zh: '搜索...' },
    itemExists: { en: 'The pixel art you are trying to share already exists on the server.', zh: '您尝试分享的像素作品已存在于服务器中。' },
    latest: { en: '<span class="mdi mdi-fire"></span> Latest', zh: '<span class="mdi mdi-fire"></span> 最新' },
    search2: { en: '<span class="mdi mdi-magnify"></span> Search', zh: '<span class="mdi mdi-magnify"></span> 搜索' },
    loadMore: { en: '<span class="mdi mdi-plus"></span> Load More', zh: '<span class="mdi mdi-plus"></span> 加载更多' },
    favorites: { en: '<span class="mdi mdi-heart-outline"></span> Favorites', zh: '<span class="mdi mdi-heart-outline"></span> 收藏夹' },
    infoName: { en: 'Name', zh: '名字' },
    infoAuthor: { en: 'Author', zh: '作者' },
    infoCreated: { en: 'Created', zh: '提交时间' },
    infoSize: { en: 'Size', zh: '大小' },
    infoCode: { en: 'Code', zh: '代码' },
    colorFull: { en: '<span class="mdi mdi-water"></span> Full Color', zh: '<span class="mdi mdi-water"></span> 全色' },
    colorTranslucent: { en: '<span class="mdi mdi-water-opacity"></span> Translucent', zh: '<span class="mdi mdi-water-opacity"></span> 半透明' },
    colorOff: {en: '<span class="mdi mdi-water-outline"></span> Off', zh: '<span class="mdi mdi-water-outline"></span> 关灯' },
    colorWhite: { en: '<span class="mdi mdi-water"></span> White', zh: '<span class="mdi mdi-water"></span> 白色的' },
    colorBlack: { en: '<span class="mdi mdi-water"></span> Black', zh: '<span class="mdi mdi-water"></span> 黑色的' },
    colorLightGrey: { en: '<span class="mdi mdi-water"></span> Light Grey', zh: '<span class="mdi mdi-water"></span> 浅灰色' },
    colorDarkGrey: { en: '<span class="mdi mdi-water"></span> Dark Grey', zh: '<span class="mdi mdi-water"></span> 深灰色' },
    inappropriateTextWarning: { en: 'The input contains inappropriate text.', zh: '输入包含不适当的文字。' },
    navLogin: { en: '<span class="mdi mdi-login"></span> Login', zh: '<span class="mdi mdi-login"></span> 登入' },
    navSignUp: { en: '<span class="mdi mdi-account-plus-outline"></span> Sign Up', zh: '<span class="mdi mdi-account-plus-outline"></span> 注册' },
    email: { en: 'Email', zh: '电邮' },
    username: { en: 'Username', zh: '用户名' },
    password: { en: 'Password', zh: '密码' },
    confirmPassword: { en: 'Confirm Password', zh: '确认密码' },
    rememberMe: { en: 'Remember me', zh: '记住我' },
    login: { en: 'Login', zh: '登入' },
    signup: { en: 'Sign Up', zh: '注册' },
    passwordNotMatch: { en: 'Password and Confirm Password does not match.', zh: '密码和确认密码不匹配。' },
    signedUp: { en: 'Thanks for signing up. Welcome to our community. We are happy to have you on board.', zh: '感谢您注册。欢迎加入我们的社区。我们非常高兴您能加入我们。' },
    invalidEmail: { en: 'Invalid email format.', zh: '电子邮件格式无效。' },
    usernameTaken: { en: 'The username is already taken.', zh: '该用户名已被使用。' },
    emailTaken: { en: 'Email Already Registered.', zh: '电子邮件已注册。' },
    incorrectUsernamePassword: { en: 'The username or password is incorrect.', zh: '用户名或密码不正确。' },
    welcomeUser: { en: 'Welcome back, {user}.', zh: '欢迎回来，{user}。' },
    failedValidateUser: { en: 'Unable to authenticate user.', zh: '无法验证用户。' },
    logout: { en: '<span class="mdi mdi-logout"></span> Logout', zh: '<span class="mdi mdi-logout"></span> 退出登录' },
    navChangePassword: { en: '<span class="mdi mdi-lock-reset"></span> Change Password', zh: '<span class="mdi mdi-lock-reset"></span> 更换密码' },
    changePassword: { en: 'Change Password', zh: '更换密码' },
    currentPassword: { en: 'Current Password', zh: '当前密码' },
    newPassword: { en: 'New Password', zh: '新密码' },
    passwordChanged: { en: 'Password changed successfully. Please log in again.', zh: '密码修改成功，请重新登录。' },
    userNotFound: { en: 'User not found.', zh: '未找到用户。' },
    incorrectPassword: { en: 'The current password is incorrect.', zh: '当前密码不正确。' },
    removed: { en: 'Your item has been removed.', zh: '您的作品已被删除。' },
    removeFailed: { en: 'Unable to remove item.', zh: '无法删除作品。' },
    update: { en: '<span class="mdi mdi-content-save-outline"></span> Update', zh: '<span class="mdi mdi-content-save-outline"></span> 更新' },
    cancel: { en: '<span class="mdi mdi-cancel"></span> Cancel', zh: '<span class="mdi mdi-cancel"></span> 取消' },
    updateTitle: { en: 'Update pixel art', zh: '更新作品' },
    updated: { en: 'The pixel artwork has been updated successfully.', zh: '像素作品已成功更新。' },
    undo: { en: '<span class="mdi mdi-undo"></span> Undo', zh: '<span class="mdi mdi-undo"></span> 撤消' },
    redo: { en: '<span class="mdi mdi-redo"></span> Redo', zh: '<span class="mdi mdi-redo"></span> 重做' },
    flip: { en: '<span class="mdi mdi-rotate-orbit"></span> Flip', zh: '<span class="mdi mdi-rotate-orbit"></span> 翻转'},
    mirror: { en: '<span class="mdi mdi-flip-to-front"></span> Mirror', zh: '<span class="mdi mdi-flip-to-front"></span> 镜像' }
};

function changeLanguage(lang) {
    localStorage.setItem('language', lang);

    switch (lang) {
        case 'chinese':
            $('#ddLanguage').html(langDB.language.zh);
            $('#ddInstall').html(langDB.installAddon.zh);
            $('li.nav-item a.nav-link[href="index.html"]').html(langDB.home.zh);
            document.title = langDB.header.zh;
            $('#size-label').html(langDB.size.zh);
            $('#import-btn').html(langDB.import.zh);
            $('#export-btn').html(langDB.export.zh);
            $('#load-btn').html(langDB.load.zh);
            $('#save-btn').html(langDB.save.zh);
            $('label[for="draw"]').html(langDB.draw.zh);
            $('label[for="fill"]').html(langDB.fill.zh);
            $('label[for="clear"]').html(langDB.erase.zh);
            $('#clear-btn').html(langDB.clear.zh);
            $('#btnInvert').html(langDB.invert.zh);
            $('#btnMirrorHorizontal').html(langDB.mirrorHorizontal.zh);
            $('#btnMirrorVertical').html(langDB.mirrorVertical.zh);
            $('#btnFlipHorizontal').html(langDB.flipHorizontal.zh);
            $('#btnFlipVertical').html(langDB.flipVertical.zh);
            $('#mouse-pos').text(langDB.position1.zh);
            $('#cell-size').text(langDB.cellsize1.zh);
            $('#modal-save-label').text(langDB.saveTitle.zh);
            $('label[for="txt-save"], label[for="txtShareName"], label[for="txtUpdateName"]').text(langDB.saveSubtitle.zh);
            $('#save-confirm-btn, #btnShareConfirm, #load-confirm-btn, #btnChangePasswordConfirm, #btnUpdateConfirm').text(langDB.submit.zh);
            $('#modal-load-label').text(langDB.loadTitle.zh);
            $('label[for="select-load"]').text(langDB.loadSubtitle.zh);
            $('#remove-confirm-btn').text(langDB.remove.zh);
            $('#community-btn').html(langDB.community.zh);
            $('#btnShare').html(langDB.share.zh);
            $('#modal-share-label').text(langDB.shareTitle.zh);
            $('#community-Label').text(langDB.communityTitle.zh);
            $('#txt-search').attr('placeholder', langDB.search.zh);
            $('#new-items-tab').html(langDB.latest.zh);
            $('#search-items-tab').html(langDB.search2.zh);
            $('#community-load-more-btn, #search-load-more-btn, #favorites-load-more-btn').html(langDB.loadMore.zh);
            $('#favorites-items-tab').html(langDB.favorites.zh);
            $('label[for="txtInfoName"]').text(langDB.infoName.zh);
            $('label[for="txtInfoAuthor"]').text(langDB.infoAuthor.zh);
            $('label[for="txtInfoDate"]').text(langDB.infoCreated.zh);
            $('label[for="txtInfoSize"]').text(langDB.infoSize.zh);
            $('label[for="txtInfoData"]').text(langDB.infoCode.zh);
            $('#btnInfoDataCopy').text(langDB.copy.zh);
            $('label[for="draw-full"]').html(langDB.colorFull.zh);
            $('label[for="draw-transparent"]').html(langDB.colorTranslucent.zh);
            $('label[for="draw-clear"]').html(langDB.colorOff.zh);
            
            $('label[for="draw-white"]').html(langDB.colorWhite.zh);
            $('label[for="draw-black"]').html(langDB.colorBlack.zh);
            $('label[for="draw-lightGrey"]').html(langDB.colorLightGrey.zh);
            $('label[for="draw-darkGrey"]').html(langDB.colorDarkGrey.zh);
            
            $('#btnLogin').html(langDB.navLogin.zh);
            $('#btnSignup').html(langDB.navSignUp.zh);
            $('label[for="txtLoginUsername"], label[for="txtSignupUsername"]').text(langDB.username.zh);
            $('label[for="txtLoginPassword"], label[for="txtSignupPassword"]').text(langDB.password.zh);
            $('label[for=txtSignupConfirmPassword], label[for="txtConfirmNewPassword"]').text(langDB.confirmPassword.zh);
            $('label[for="txtSignupEmail"]').text(langDB.email.zh);
            $('label[for="chkLoginRemember"]').text(langDB.rememberMe.zh);
            $('#btnLoginConfirm').text(langDB.login.zh);
            $('#modal-signup-label').text(langDB.signup.zh);
            $('#btnSignupConfirm').text(langDB.signup.zh);
            $('#aLogout').html(langDB.logout.zh);
            $('#aPassword').html(langDB.navChangePassword.zh);
            $('#modal-change-password-label').text(langDB.changePassword.zh);
            $('label[for="txtCurrentPassword"]').text(langDB.currentPassword.zh);
            $('label[for="txtNewPassword"]').text(langDB.newPassword.zh);
            $('#btnUpdateItem').text(langDB.update.zh);
            $('#btnDeleteItem').text(langDB.remove.zh);
            $('#btnUpdateEdit').html(langDB.update.zh);
            $('#btnCancelEdit').html(langDB.cancel.zh);
            $('#modal-update-label').text(langDB.updateTitle.zh);
            $('#btnUndo').html(langDB.undo.zh);
            $('#btnRedo').html(langDB.redo.zh);
            $('#ddFlip').html(langDB.flip.zh);
            $('#ddMirror').html(langDB.mirror.zh);
            break;
        default:
            $('#ddLanguage').html(langDB.language.en);
            $('#ddInstall').html(langDB.installAddon.en);
            $('li.nav-item a.nav-link[href="index.html"]').html(langDB.home.en);
            document.title = langDB.header.en;
            $('#size-label').html(langDB.size.en);
            $('#import-btn').html(langDB.import.en);
            $('#export-btn').html(langDB.export.en);
            $('#load-btn').html(langDB.load.en);
            $('#save-btn').html(langDB.save.en);
            $('label[for="draw"]').html(langDB.draw.en);
            $('label[for="fill"]').html(langDB.fill.en);
            $('label[for="clear"]').html(langDB.erase.en);
            $('#clear-btn').html(langDB.clear.en);
            $('#btnInvert').html(langDB.invert.en);
            $('#btnMirrorHorizontal').html(langDB.mirrorHorizontal.en);
            $('#btnMirrorVertical').html(langDB.mirrorVertical.en);
            $('#btnFlipHorizontal').html(langDB.flipHorizontal.en);
            $('#btnFlipVertical').html(langDB.flipVertical.en);
            $('#mouse-pos').text(langDB.position1.en);
            $('#cell-size').text(langDB.cellsize1.en);
            $('#modal-save-label').text(langDB.saveTitle.en);
            $('label[for="txt-save"], label[for="txtShareName"]').text(langDB.saveSubtitle.en);
            $('#save-confirm-btn, #btnShareConfirm, #load-confirm-btn, #btnChangePasswordConfirm').text(langDB.submit.en);
            $('#modal-load-label').text(langDB.loadTitle.en);
            $('label[for="select-load"]').text(langDB.loadSubtitle.en);
            $('#remove-confirm-btn').text(langDB.remove.en);
            $('#community-btn').html(langDB.community.en);
            $('#btnShare').html(langDB.share.en);
            $('#modal-share-label').text(langDB.shareTitle.en);
            $('#community-Label').text(langDB.communityTitle.en);
            $('#txt-search').attr('placeholder', langDB.search.en);
            $('#new-items-tab').html(langDB.latest.en);
            $('#search-items-tab').html(langDB.search2.en);
            $('#community-load-more-btn, #search-load-more-btn, #favorites-load-more-btn').html(langDB.loadMore.en);
            $('#favorites-items-tab').html(langDB.favorites.en);
            $('label[for="txtInfoName"]').text(langDB.infoName.en);
            $('label[for="txtInfoAuthor"]').text(langDB.infoAuthor.en);
            $('label[for="txtInfoDate"]').text(langDB.infoCreated.en);
            $('label[for="txtInfoSize"]').text(langDB.infoSize.en);
            $('label[for="txtInfoData"]').text(langDB.infoCode.en);
            $('#btnInfoDataCopy').text(langDB.copy.en);
            $('label[for="draw-full"]').html(langDB.colorFull.en);
            $('label[for="draw-transparent"]').html(langDB.colorTranslucent.en);
            $('label[for="draw-clear"]').html(langDB.colorOff.en);
            $('label[for="draw-white"]').html(langDB.colorWhite.en);
            $('label[for="draw-black"]').html(langDB.colorBlack.en);
            $('label[for="draw-lightGrey"]').html(langDB.colorLightGrey.en);
            $('label[for="draw-darkGrey"]').html(langDB.colorDarkGrey.en);
            $('#btnLogin').html(langDB.navLogin.en);
            $('#btnSignup').html(langDB.navSignUp.en);
            $('label[for="txtLoginUsername"], label[for="txtSignupUsername"]').text(langDB.username.en);
            $('label[for="txtLoginPassword"], label[for="txtSignupPassword"]').text(langDB.password.en);
            $('label[for=txtSignupConfirmPassword], label[for="txtConfirmNewPassword"]').text(langDB.confirmPassword.zh);
            $('label[for="txtSignupEmail"]').text(langDB.email.en);
            $('label[for="chkLoginRemember"]').text(langDB.rememberMe.en);
            $('#btnLoginConfirm').text(langDB.login.en);
            $('#modal-signup-label').text(langDB.signup.en);
            $('#btnSignupConfirm').text(langDB.signup.en);
            $('#aLogout').html(langDB.logout.en);
            $('#aPassword').html(langDB.navChangePassword.en);
            $('#modal-change-password-label').text(langDB.changePassword.en);
            $('label[for="txtCurrentPassword"]').text(langDB.currentPassword.en);
            $('label[for="txtNewPassword"]').text(langDB.newPassword.en);
            $('#btnUpdateItem').text(langDB.update.en);
            $('#btnDeleteItem').text(langDB.remove.en);
            $('#btnUpdateEdit').html(langDB.update.en);
            $('#btnCancelEdit').html(langDB.cancel.en);
            $('#modal-update-label').text(langDB.updateTitle.en);
            $('#btnUndo').html(langDB.undo.en);
            $('#btnRedo').html(langDB.redo.en);
            $('#ddFlip').html(langDB.flip.en);
            $('#ddMirror').html(langDB.mirror.en);
    }

    $('body').attr('data-language', lang);
};

function getCorrectTranslation(lang) {
    let body = $('body').attr('data-language');
    switch (body) {
        case 'chinese':
            return langDB[lang].zh
            break;
        default:
            return langDB[lang].en
    }
    return null;
}