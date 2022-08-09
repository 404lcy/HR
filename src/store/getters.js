const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  // avatar: state => state.user.avatar,
  name: state => state.user.userInfor.username, // 建立用户名称的映射
  userId: state => state.user.userInfor.userId,
  avatar: state => state.user.userInfor.staffPhoto,
  companyId: state => state.user.userInfor.companyId,
  routes: state => state.permission.routes
}
export default getters

