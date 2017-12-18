// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import axios from 'axios'
import axios from './assets/js/fetch.js'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './assets/css/green-theme/index.less'
import layout from "./assets/js/layout.js"

Vue.prototype.$http = axios
Vue.prototype.$layout = layout

Vue.use(iView)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
