<template>
  <v-app class="vApp">
    <div class="mainComponent" id="app">
        <nav class="nav">
          <div class="navItem"><h2>{{username}}</h2></div>
          <div class="navItem"></div>
          <div class="navItem mobileNavItem logout"><router-link to="home">Home</router-link></div>
          <div class="navItem mobileNavItem"></div>
          <div class="navItem mobileNavItem logout" @click="logout"><h2>Logout</h2></div>
        </nav>
        <transition name="fade"><router-view class="routerView"
          @captureUserName="captureUserName"
          @captureGameId="captureGameId"
          @captureGameName="captureGameName"
          :username="username"
          :gameName="gameName"
          :game_id="game_id">
        </router-view></transition>
    </div>
  </v-app>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      username: '',
      game_id: '',
      gameName: '',
      clicked: true
    }
  },
  methods: {
    logout: function() {
      firebase.auth().signOut();
      this.username = ''
      this.game_id = ''
      this.$router.push('/')
    },
    captureUserName: function(capturedName) {
      this.username = capturedName
    },
    captureGameName: function(capturedGameName) {;
      this.gameName = capturedGameName
    },
    captureGameId: function (capturedGameId) {
      this.game_id = capturedGameId
    },
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;

}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;

}
</style>
