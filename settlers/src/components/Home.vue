<template>
  <div id="main">
    <h1 class="display-2 mt-5 pa-5">Welcome, {{username}}</h1>
    <v-btn class="yellow" @click="startGame" v-if="startButton">Create Game</v-btn>
    <v-btn class="yellow" @click="resumeGame" v-if="resumeButton">Resume Game</v-btn>
    <v-btn class="yellow" @click="joinGame">Join Game</v-btn>
    <v-btn class="yellow" @click="compareStats">Compare Stats</v-btn>
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
        resumeButton: false,

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
      },
      compareStats: function() {
        console.log('comparing');
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
