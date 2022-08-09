import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
const loginPath = '/login'
const nonFoundPath = '/404'

const whiteList = [loginPath, nonFoundPath]
// 设置路由拦截
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  const token = store.getters.token
  if (token) {
    if (!store.getters.userId) {
      const res = await store.dispatch('user/getUserInfo')
      console.log(res)
      const routers = await store.dispatch('permission/filterRoutes', res.roles.menus)
      // 进行动态路由添加
      router.addRoutes([...routers, { path: '*', redirect: '/404', hidden: true }])
      // 重新再进行跳转
      next(to.path)
    }
    if (to.path === loginPath) {
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(loginPath)
    }
  }
})
router.afterEach(function() {
  NProgress.done()
})
