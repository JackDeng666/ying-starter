const auth = {
  text: {
    app_title: 'Ying Starter',
    welcome_to: '欢迎来到 Ying Starter',
    email: '邮箱',
    please_enter_email: '请输入邮箱',
    password: '密码',
    please_enter_password: '请输入密码',
    forgot_password: '忘记密码？',
    login: '登录',
    no_account: '没有账号？',
    nickname: '昵称',
    please_enter_nickname: '请输入昵称',
    register: '注册',
    already_have_an_account: '已经有帐号了？',
    register_an_account: '注册账号',
    google_login: 'Google 登录',
    github_login: 'Github 登录',
    facebook_login: 'Facebook 登录',
    back_to_login: '回到登录',
    send_reset_email: '发送重置邮件',
    reset_password: '重置密码',
    old_password: '旧密码',
    please_enter_old_password: '请输入您的旧密码',
    new_password: '新密码',
    please_enter_new_password: '请输入您的新密码',
    confirm_your_verification: '确认您的验证',
    personal_information: '个人信息',
    avatar: '头像',
    confirm_modifications: '确认修改',
    set_password: '设置密码',
    confirm_reset: '确认重置',
    logout: '退出'
  },
  validation: {
    email_should_not_be_empty: '邮箱不能为空',
    incorrect_email_format: '邮箱格式不正确',
    password_should_not_be_empty: '密码不能为空',
    incorrect_password_format: "密码必须包含数字、小写字母、大写字母和特殊符号[！@#$%^&*；'，.]",
    nickname_should_not_be_empty: '昵称不能为空',
    token_should_not_be_empty: 'token 不能为空',
    new_password_should_not_be_empty: '新密码不能为空'
  },
  success: {
    email_verified_successfully: '邮箱已验证成功！',
    confirm_email_has_been_sent: '确认电子邮件已经发送！',
    password_reset_email_sent_successfully: '重置密码邮件发送成功！',
    password_changed_successfully: '修改密码成功！',
    image_uploaded_successfully: '图片上传成功！',
    successfully_modified_user_information: '修改用户信息成功！'
  },
  error: {
    the_email_has_been_registered: '邮箱已经被注册！',
    token_is_invalid: 'token 无效!',
    email_does_not_exist: '邮箱不存在！',
    the_email_has_not_been_verified_yet: '邮箱尚未验证！',
    password_error: '密码错误！',
    old_password_error: '旧密码错误！',
    password_modification_successful: '密码修改成功！'
  }
}

export default auth
