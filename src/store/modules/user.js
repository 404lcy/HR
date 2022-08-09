import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
import { setToken, removeToken, getToken, setTimeStamp } from '@/utils/auth'
// 状态
const state = {
  // 1.设置token，并把他写入cookie
  token: getToken(),
  userInfor: {}
}
// 修改状态
const mutations = {
  // 2.把token写到cookis
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  // 3.退出修改token
  removeToken(state) {
    state.token = null
    removeToken()
  },
  setUserInfor(state, userInfor) {
    state.userInfor = userInfor
  },
  removeUserInfor(state) {
    state.userInfor = {}
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    const res = await login(data)
    // 把token写入connk
    context.commit('setToken', res)
    setTimeStamp()
  },
  async getUserInfo(context) {
    const res = await getUserInfo()
    const baseInfo = await getUserDetailById(res.userId)

    context.commit('setUserInfor', { ...res, ...baseInfo })
    return {
      ...res,
      ...baseInfo
    }
  },
  // 退出功能
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfor')
    resetRouter()
    // vuex里面的路由表置空
    context.commit('permission/setRotures', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

