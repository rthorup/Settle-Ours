import vueRouter from 'vue-router'

import Auth from './components/Auth.vue';
import Home from './components/Home.vue';
import Main from './components/Main.vue';
import Username from './components/Username.vue';
import Creategame from './components/Creategame.vue';
import Currentgame from './components/Currentgame.vue';
import Joingame from './components/Joingame.vue'

const router = new vueRouter({
  mode: 'history',
  routes: [{
      path: '/',
      component: Main,
      props: true
    }, {
      path: '/login',
      component: Auth,
      props: true
    },
    {
      path: '/home',
      component: Home,
      props: true
    },
    {
      path: '/username',
      component: Username,
      props: true
    },
    {
      path: '/creategame',
      component: Creategame,
      props: true
    },
    {
      path: '/currentgame',
      component: Currentgame,
      props: true
    },
    {
      path: '/joingame',
      component: Joingame,
      props: true
    }
  ]
});

export default router;