import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/vant.js'
import 'lib-flexible'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import bus from '@util/bus'
Vue.use(VueAwesomeSwiper)
Vue.prototype.$bus = bus
Vue.config.productionTip = false
window.isInit = false

// alert(123456)
// console.log('appcanReadyappcanReadyappcanReady2')

// if (!window.isInit) {

//   window.isInit = true
// }
window.appcanReady = function () {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}
