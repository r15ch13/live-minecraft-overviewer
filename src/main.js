import Vue from 'vue'
import App from './App.vue'
import AsyncComputed from 'vue-async-computed'
import VueResource from 'vue-resource'

Vue.use(VueResource)
Vue.use(AsyncComputed)

Vue.http.options.root = window.settings.webapi.url

new Vue({
  el: '#app',
  render: h => h(App)
})
