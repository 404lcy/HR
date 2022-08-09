
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
const TimeOut = 60000000 // 定义超时时间 单位s
const request = axios.create({
  // process.env固定语法
  baseURL: process.env.VUE_APP_BASE_API
})// 创建axios实例
// 设置请求拦截器
// request.interceptors.request.use(
//   config => {
//     const token = store.getters.token
//     // 如果token存在，请求的时候需要把token携带请求头
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   }, error => Promise.reject(error)
// )
function isCheckTime() {
  return Date.now() - getTimeStamp() < TimeOut
}
request.interceptors.request.use(config => {
  // 在这个位置需要统一的去注入token
  if (store.getters.token) {
    if (isCheckTime()) {
      // 如果token存在 注入token
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    } else {
      Message.error('登入过期，请重新登入！')
      store.dispatch('user/logout')
      router.push('/')
      return Promise.reject('')
    }
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error)
})
request.interceptors.response.use(response => {
  // 通过接口响应回来的数据
  // 判断success是否为true
  // true的话是请求成功，data就可以直接使用了
  const { data: { data, success, message }} = response

  if (success) {
    return data
  }
  // 如果代码走到这，证明success不存在，接口有问题，提示错误
  Message.error(message || '系统错误')
  // 失败的promise 给接口请求提示报错
  return Promise.reject(message || '系统错误')
}, error => {
  // 如果是401退出登入 跳转请求接口的地方 报错

  if (error.response.status === 401) {
    store.dispatch('user/logout')
    router.push('/login')
  }
  Message.error(error.response?.data?.message || '系统错误')
  return Promise.reject(error)
}
)// 设置响应拦截器
export default request// 默认导出request请求

