<template>
  <div class ="spacer" id="join">
    <div class="gameList">
      <div class="validateError" v-if="validateTrue">
        <h2 clas="display-3">{{errMessage}}</h2>
      </div>
      <h1 class="display-2">Enter game name:</h1>
      <v-text-field class="input pr-4 pl-4 pb-1 pt-2 mb-4 mt-4" v-model="joinGameName" placeholder="Game Name"> </v-text-field>
      <h1 class="display-1">OR</h1>
      <h1 class="display-2">Enter game #: </h1>
      <v-text-field class="input pr-4 pl-4 pb-1 pt-2 mb-5 mt-4" v-model="joinGameId" placeholder="Game ID #"> </v-text-field>
      <v-btn class="yellow" @click="joinGame">J o i n</v-btn>
    </div>
    <template>
      <v-layout column>
        <v-dialog v-model="dialog" persistent max-width="490">
          <!-- <v-btn color="primary" dark slot="activator">Open Dialog</v-btn> -->
          <v-card class="modalStyle">
            <v-card-title class="display-1">Success!</v-card-title>
            <h2 class="display-1 playerName">{{confirmation}}</h2>
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
    props: ['gameName', 'game_id', 'username'],
    created () {
      if(this.username === "") {
        this.$router.push('/username')
      }
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
        this.validateTrue = false;
        if (this.joinGameName ==='' && this.joinGameId === '') {
          this.errMessage = 'Please enter either a game name or game id to join'
          this.validateTrue = true;
          return
        }
        if (this.joinGameName !== '') {
          axios.post('http://localhost:3000/joingamename', {game_name: this.joinGameName})
          .then((response) => {
            console.log(response);
            if(response.data.length === 0) {
              this.errMessage = "Not a valid game name. Try reentering game name or search by game id"
              this.validateTrue = true;
              return
            };
            axios.post('http://localhost:3000/join', {auth_id: this.id, game_id: response.data[0].game_id, username: this.username})
            .then((response) => {
              console.log(response.data);
              if(response.data.code  === 'ER_DUP_ENTRY') {
                this.errMessage = 'Sorry but it looks like you have already joined the game.'
                this.validateTrue = true;
              }
              else if(response.data === 'success'){
                this.confirmation = `You have succefully joined ${this.joinGameName}`
                this.dialog = true
              }
              else {
                console.log('something wrong. contact administrator');
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
          console.log('testing id');
          axios.post('http://localhost:3000/join', {auth_id: this.id, game_id: this.joinGameId, username: this.username})
          .then((response) => {
            console.log(response.data);
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
