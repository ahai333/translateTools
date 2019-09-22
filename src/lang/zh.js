import compareView from './zh/compareView'

export default {
  route: {
    dashboard: '首页',
    documentation: '文档',
    guide: '引导页',
    permission: '权限测试页',
    rolePermission: '角色权限',
    pagePermission: '页面权限',
    directivePermission: '指令权限',
    avatarUpload: '头像上传',
    dropzone: 'Dropzone',
    sticky: 'Sticky',
    countTo: 'Count To',
    backToTop: '返回顶部',
    errorPages: '错误页面',
    page401: '401',
    page404: '404',
    errorLog: '错误日志',
    theme: '换肤',
    i18n: '国际化',
    externalLink: '外链',
    profile: '个人中心',
    preTrans: '机器翻译',
    machineTranslate: '机器翻译',
    preMatch: '查重',
    calcMatch: '相似度',
    translated: '译后评估',
    check: '检测',
    system: '系统设置',
    admin: '用户管理',
    config: '配置',
    log: '操作记录',
    syslog: '系统日志',
    detail: '详情',
    similarity: '相似度',
    similarityIndex: '计算相似度',
    compare: '文本比较',
    compareIndex: '文本比较',
    mt: '机器翻译',
    mtIndex: '机器翻译'
  },
  navbar: {
    dashboard: '首页',
    github: '项目地址',
    logOut: '退出登录',
    profile: '个人中心',
    theme: '换肤',
    size: '布局大小'
  },
  login: {
    title: '系统登录',
    logIn: '登录',
    username: '账号',
    password: '密码',
    any: '随便填',
    thirdparty: '第三方登录',
    thirdpartyTips: '本地不能模拟，请结合自己业务进行模拟！！！',
    checkpass: '密码长度不少于6个字符',
    checkusername: '请输入正确用户名'
  },
  permission: {
    addRole: '新增角色',
    editPermission: '编辑权限',
    roles: '你的权限',
    switchRoles: '切换权限',
    tips:
      '在某些情况下，不适合使用 v-permission。例如：Element-UI 的 el-tab 或 el-table-column 以及其它动态渲染 dom 的场景。你只能通过手动设置 v-if 来实现。',
    delete: '删除',
    confirm: '确定',
    cancel: '取消'
  },
  guide: {
    description:
      '引导页对于一些第一次进入项目的人很有用，你可以简单介绍下项目的功能。本 Demo 是基于',
    button: '打开引导'
  },
  tagsView: {
    refresh: '刷新',
    close: '关闭',
    closeOthers: '关闭其它',
    closeAll: '关闭所有'
  },
  settings: {
    title: '系统布局配置',
    theme: '主题色',
    tagsView: '开启 Tags-View',
    fixedHeader: '固定 Header',
    sidebarLogo: '侧边栏 Logo'
  },
  transView: {
    index: '序号',
    engine: '翻译引擎',
    engineselect: '请选择翻译引擎',
    source: '源语言',
    selectPlaceholder: '请选择',
    target: '目标语言',
    beginTranslate: '开始',
    exportExcel: '导出到excel',
    downloadModelFile: '模板文件下载',
    machineTranslate: '机器翻译',
    errorFile: '上传文件格式错误',
    errorSize: '上传文件应不大于1Mb',
    similarity: '相似度(%)',
    clear: '清除结果'
  },
  logView: {
    operate: '操作',
    starttime: '开始时间',
    endtime: '结束时间',
    content: '内容',
    remarks: '备注',
    source: '源语言',
    engine: '翻译引擎',
    target: '目标语言',
    mt: '机器翻译',
    similarity: '相似度(%)'
  },
  systemView: {
    addnew: '添加新用户',
    username: '用户名',
    email: '邮箱',
    role: '权限',
    expire: '有效期',
    password: '密码',
    remarks: '备注',
    view: '查看/编辑',
    changepwd: '确实要修改密码?',
    similarity: '相似度',
    submit: '提交',
    cancel: '取消',
    selectPlaceholder: '请选择'
  },
  components: {
    selectPlaceholder: '请选择',
    exportExcel: '导出到excel',
    query: '查询',
    operate: '操作',
    edit: '编辑',
    remove: '批量删除',
    delete: '删除'
  },
  compareView
}
