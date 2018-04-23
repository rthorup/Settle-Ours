<!-- page where user is directed to once they click create game in home page -->
<template>
  <div id="createGame">
      <h1 class="display-2 pa-5">{{msg}}</h1>
      <!-- div that appears if there is an error below -->
        <div class="validateError" v-if="validateTrue">
          <h2 clas="display-3">{{errMessage}}</h2>
        </div>
      <v-text-field class="input pr-4 pl-4 pb-0 pt-2 display-4" placeholder="Enter game name here" v-model="newGameName" /></v-text-field>
        <v-btn @click="submitGame" class="yellow ma-5">Create Game</v-btn>
      <template>
      <v-layout column>
        <v-dialog v-model="dialog" persistent max-width="600">
          <v-card class="modalStyle">
            <v-card-title class="display-2">Start new game called "{{newGameName}}"?</v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="redButton pa-2" @click.native="dialog = false">Wait, nevermind</v-btn>
                <v-spacer></v-spacer>
                <v-btn class="yellow pa-2" @click="confirmGame">Confirm</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </template>
  </div>
</template>

<script>
  import axios from 'axios';
  import firebase from 'firebase';
  export default {
    name: 'Creategame',
    props: ['gameName', 'game_id', 'username', 'url'],
    created () {
      //checking for user and capturing id. if none send back to login.
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.id = user.uid
        }
        else {
          this.$router.push('/login')
        }
      });
    },
    data() {
      return {
        msg: "Create a new game",
        newGameName: '',
        id: '',
        errMessage: '',
        validateTrue: false,
        dialog: false
      }
    },
    methods: {
      submitGame: function () {
          //can't be a blank game name;
        this.validateTrue = false
        if (this.newGameName === '') {
          this.errMessage = 'Game name cannot be blank.';
          this.validateTrue = true;
          this.newGameName === '';
          return
        }
        //checking game name length
        if(this.newGameName.length < 4) {
          this.errMessage = 'Game names must be at least 4 characters.';
          this.validateTrue = true;
          this.newGameName = '';
          return
        }
        //checking for common names
        if(this.newGameName === 'New Game' || this.newGameName === "My Game" ||this.newGameName === "First Game" || this.newGameName === 'Test') {
          this.errMessage =`"${this.newGameName}" is not a valid game name. Please enter a new game name.`;
          this.validateTrue = true;
          this.newGameName = '';
          return
        }
        this.dialog = true;
      },
      confirmGame: function() {
        axios.post(this.url + "/game", {auth_id: this.id, game_name: this.newGameName})
            .then((response) => {
              // seeing if there is any err code in the returned data
              if(response.data.code) {
                console.log(resonse.data.code);
              } else {
                axios.post(this.url +'/gameid', {auth_id: this.id})
                .then((response) => {
                  let gameId = response.data[0].game_id
                  // capturing as global variables
                  this.$emit('captureGameId', response.data[0].game_id)
                  this.$emit('captureGameName', this.newGameName)
                  // after successfully creating new game, automatically joins the user as first in game table.
                  axios.post(this.url +'/join', {auth_id: this.id, game_id: gameId, username: this.username})
                    .then((response) => {
                      //automatically redirects to current game page
                        this.$router.push('/currentgame')
                    })
                    .catch((error) => {
                      console.log(error);
                    })
                })
                .catch((error) =>{
                  console.log(error);
                });
              }
            })
            .catch((error) =>{
              console.log(error);
            });

      }
    }
  }
</script>
