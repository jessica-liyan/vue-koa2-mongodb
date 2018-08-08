import Vue from 'vue'
import App from './App.vue'
import VueSocketio from 'vue-socket.io';
import socketio from 'socket.io-client'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import router from './router.js'
import VueLocalStorage from 'vue-localstorage'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import store from './store'

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.use(VueLocalStorage, {
  name: 'storage',
  bind: true
})
Vue.use(mavonEditor)
Vue.use(VueSocketio, socketio('http://192.168.4.76:4000'), store);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
