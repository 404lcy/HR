import { asyncRoutes, constantRoutes } from '@/router'
const store = {
  routes: constantRoutes
}
const mutations = {
  setRotures(state, nweRouter) {
    state.routes = [...constantRoutes, ...nweRouter]
  }
}
const actions = {
  filterRoutes(context, menus) {
    console.log('constantRoutes', constantRoutes)
    const resRouters = asyncRoutes.filter(item => {
      return menus.includes(item.name)
    })
    console.log(resRouters)
    context.commit('setRotures', resRouters)
    return resRouters
  }
}
export default {
  namespaced: true,
  store,
  mutations,
  actions
}
