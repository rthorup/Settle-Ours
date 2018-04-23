<template>
  <div id="join">
    <!-- div to handle errors -->
    <div class="gameList">
      <div class="validateError mt-4" v-if="validateTrue">
        <h2 clas="display-3">{{errMessage}}</h2>
      </div>
      <h1 class="display-2 pt-4">Enter game name:</h1>
      <v-text-field class="input pr-2 pl-2 pb-1 pt-2 mb-4 mt-4" v-model="joinGameName" placeholder="Game Name"> </v-text-field>
      <h1 class="display-1">OR</h1>
      <h1 class="display-2 pa-3">Enter game #: </h1>
      <v-text-field class="input pr-2 pl-2 pb-1 pt-2 mb-4 mt-4" v-model="joinGameId" placeholder="Game ID #"> </v-text-field>
      <v-btn class="yellow" @click="joinGame">J o i n</v-btn>
    </div>
    <template>
      <v-layout column>
        <v-dialog v-model="dialog" persistent max-width="490">
          <v-card class="modalStyle">
            <v-card-title class="display-1"></v-card-title>
            <h2 class="display-1">{{confirmation}}</h2>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green" @click="goHome">Okay</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </template>
  </div>
</template>

<script>
import firebase from 'firebase'
import axios from 'axios'
  export default {
    name: 'Joingame',
    props: ['gameName', 'game_id', 'username', 'url'],
    //checking for username or redirecting
    created () {
      if(this.username === "") {
        this.$router.push('/username')
      }
      //checking for user or redirecting
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.id = user.uid
        }
        else {
          this.$router.push('/auth')
        }
      })
    },
    data() {
      return {
        msg: "Join page",
        test: 'this is working',
        id: '',
        joinGameName: '',
        joinGameId: '',
        dialog: false,
        errMessage: '',
        validateTrue: false,
        confirmation: ''
      }
    },
    methods: {
      joinGame: function() {
        //checking for blank games
        this.validateTrue = false;
        if (this.joinGameName ==='' && this.joinGameId === '') {
          this.errMessage = 'Please enter either a game name or game id to join'
          this.validateTrue = true;
          return
        }
        if (this.joinGameName !== '') {
          //if they used gamename, check this first and capture game_id
          axios.post(this.url +'/joingamename', {game_name: this.joinGameName})
          .then((response) => {
            if(response.data.length === 0) {
              this.errMessage = "Not a valid game name. Try reentering game name or search by game id"
              this.validateTrue = true;
              return
            };
            //then checking by game_id
            axios.post(this.url +'/join', {auth_id: this.id, game_id: response.data[0].game_id, username: this.username})
            .then((response) => {
              if(response.data.code  === 'ER_DUP_ENTRY') {
                this.errMessage = 'Sorry but it looks like you have already joined the game.'
                this.validateTrue = true;
              }
              else if(response.data === 'success'){
                this.confirmation = `You have successfully joined "${this.joinGameName}"`
                this.dialog = true
              }
              else {
                this.errMessage = 'Something went wrong while trying to join the game. Please try again.'
                this.validateTrue = true;
              }
            })
            .catch((err) => {
              console.log(err);
            })
          })
          .catch((err) => {
              console.log(err);
          })
        }
        if (this.joinGameId !== '') {
          //if they search by game_id
          axios.post(this.url +'/join', {auth_id: this.id, game_id: this.joinGameId, username: this.username})
          .then((response) => {
            if(response.data.code  === 'ER_DUP_ENTRY') {
              this.errMessage = 'Sorry but it looks like you have already joined the game.'
              this.validateTrue = true;
            }
            else if(response.data === 'success'){
              this.confirmation = `You have succefully joined game number: ${this.joinGameId}`
              this.dialog = true
            }
            else {
              this.errMessage = 'Something is wrong with the database. Please contact the administrator.'
              this.validateTrue = true;
            }
          })
          .catch((err) => {
            console.log(err);
          })
        }
      },
      goHome: function() {
        this.$router.push('/home')
      }
      }
  }

</script>
