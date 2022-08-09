import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import * as directives from '@/directives/index'

for (const key in directives) {
  Vue.directive(key, directives[key])
}

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import Component from '@/components'
Vue.use(Component) // 注册自己的插件
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

// 注册过滤器
import * as filters from '@/filters/index'
// 所有过滤器，进行全局注册
for (const key in filters) {
  Vue.filter(key, filters[key])
}
Vue.config.productionTip = false

// 打印
import Print from 'vue-print-nb'
Vue.use(Print)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
export const imageerror = {
  inserted(dom, options) {
    //   图片异常的逻辑
    //  监听img标签的错误事件  因为图片加载失败 会触发  onerror事件
    dom.src = dom.src || options.value

    dom.onerror = function() {
      // 图片失败  赋值一个默认的图片
      dom.src = options.value
    }
  },
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}

