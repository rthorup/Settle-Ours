<template>
  <div id="main">
    <h1>{{msg}}</h1>
    <h2>Welcome, {{username}}</h2>
    <button @click="startGame" v-if="startButton">Create Game</button>
    <button @click="resumeGame" v-if="resumeButton">Resume Game</button>
    <button @click="joinGame">Join Game</button>
    <button>Compare Stats</button>
  </div>
</template>

<script>
import firebase from 'firebase'
import axios from 'axios'
  export default {
    name: 'Main',
    props: ['gameName', 'game_id', 'username'],
    created () {
      if(this.username === "") {
        this.$router.push('/username')
      }
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.id = user.uid
          axios.post('http://localhost:3000/gamecheck', {auth_id: this.id})
          .then((results) => {
            console.log(results.data.status);
            if(results.data.status === false) {
              this.resumeButton = !this.resumeButton
              return
            } else {
              console.log('ready to start game');
              this.startButton = !this.startButton
            }
          })
          .catch((error) =>{
            console.log(error);
          });
        }
        else {
          this.$router.push('/login')
        }
      })
    },
    data() {
      return {
        msg: "Home page",
        id: '',
        startButton: false,
        resumeButton: false
      }
    },
    methods: {
      startGame: function () {
        console.log('starting!');
        this.$router.push('/creategame')
      },
      resumeGame: function() {
        console.log('working');
        this.$router.push('/currentgame')
      },
      joinGame: function() {
        console.log('joining');
        this.$router.push('/joingame')
      }
    }
  }

</script>
<style>
  .startButton {
    display: none;
  }
  .resumeButton {
    display: none;
  }
</style>
