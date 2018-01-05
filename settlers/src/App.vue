<template>
  <div id="app">
    <nav class="nav">
      <div>{{username}}</div>
      <div><router-link to="/home">Home</router-link></div>
      <div><router-link to="/username">Username</router-link></div>
      <div><router-link to="/">Main</router-link></div>
      <div class="logout" @click="logout">Logout</div>
    </nav>
    <router-view
      @captureUserName="captureUserName"
      @captureGameId="captureGameId"
      @captureGameName="captureGameName"
      :username="username"
      :gameName="gameName"
      :game_id="game_id">
    </router-view>
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}
.logout:hover {
  background-color: grey;
  color:white;
}
nav {
  display: flex;
  justify-content: center;
  align-items: center;
}
nav div {
  flex: 1;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
