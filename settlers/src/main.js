import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import firebase from 'firebase'
import firebaseui from 'firebaseui'
import {
  config
} from './connection/config.js'
import Vuetify from 'vuetify'

Vue.use(Vuetify)
Vue.use(VueRouter)

new Vue({
  created() {
    firebase.initializeApp(config);
  },
  data: {
    ui: '',
  },
  el: '#app',
  router: router,
  render: h => h(App)
})