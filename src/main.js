import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import AsyncComputed from 'vue-async-computed'

Vue.use(AsyncComputed)

axios.defaults.baseURL = `${window.config.api.url}/api/v5/`
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['X-WEBAPI-KEY'] = window.config.api.key

new Vue({
  el: '#app',
  render: h => h(App)
})
