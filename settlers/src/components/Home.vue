<template>
  <div class="auth" id="main">
    <h1 class="display-3 mt-0 pa-4 fullWidth">Welcome, {{username}}</h1>
    <h1 class="display-1 mt-0 pa-4 mobileWidth">Welcome, {{username}}</h1>
    <div class="logoSpan mt-5">
      <v-btn class="yellow ma-2" @click="startGame" v-if="startButton">Create Game</v-btn>
      <v-btn class="yellow ma-2" @click="resumeGame" v-if="resumeButton">Resume Game</v-btn>
      <v-btn class="yellow ma-2" @click="joinGame">Join Game</v-btn>
      <v-btn class="yellow ma-2" @click="compareStats">See Stats</v-btn>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

import axios from 'axios'
  export default {
    name: 'Main',
    props: ['gameName', 'game_id', 'username'],
    created () {
      //checking for username and redirecting to get it
      if(this.username === "") {
        this.$router.push('/username')
      }
      //checking for user. if user, check for open game. else make them login
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.id = user.uid
          axios.post('https://settle-ours.herokuapp.com/gamecheck', {auth_id: this.id})
          .then((results) => {
            if(results.data.status === false) {
              this.resumeButton = !this.resumeButton
              return
            } else {
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
        resumeButton: false,

      }
    },
    methods: {
      startGame: function () {
        this.$router.push('/creategame')
      },
      resumeGame: function() {
        this.$router.push('/currentgame')
      },
      joinGame: function() {
        this.$router.push('/joingame')
      },
      compareStats: function() {
        this.$router.push('/stats')
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
