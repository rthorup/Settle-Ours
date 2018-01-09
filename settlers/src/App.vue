<template>
  <div class="mainComponent" id="app">
    <nav class="nav">
      <div lg4 xs12 class="navItem"><h2>{{username}}</h2></div>
      <div lg4 xs12 class="navItem"></div>
      <div lg4 xs12 class="navItem"><router-link to="home">Home</router-link></div>
      <div lg4 xs12 class="navItem"></div>
      <div lg4 xs12 class="navItem logout" @click="logout"><h2>Logout</h2></div>
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
      ui: ''
    }
  },
  methods: {
    logout: function() {
      console.log('working');
      firebase.auth().signOut();
      this.username = ''
      this.game_id = ''
      this.$router.push('/login')
    },
    captureUserName: function(capturedName) {
      // console.log('capturing username');
      this.username = capturedName
    },
    captureGameName: function(capturedGameName) {
      // console.log('capturing game name');
      this.gameName = capturedGameName
    },
    captureGameId: function (capturedGameId) {
      console.log('capturing game id');
      this.game_id = capturedGameId
    }
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
