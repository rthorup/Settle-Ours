<template>
  <div id="createGame">
    <v-container>
      <v-layout column>
        <v-flex class="mt-5"><h1 class="display-2">{{msg}}</h1></v-flex>
        <div class="validateError" v-if="validateTrue">
          <h2 clas="display-3">{{errMessage}}</h2>
        </div>
        <v-flex xs-4 ma-4><v-text-field class="input pr-4 pl-4 pb-1 pt-2 display-4" placeholder="Enter game name here" v-model="newGameName" /></v-text-field></v-flex>
        <v-flex><v-btn @click="submitGame" dark slot="activator" color="yellow">Create Game</v-btn></v-flex>
      </v-layout>
    </v-container>
    <template>
      <v-layout column>
        <v-dialog v-model="dialog" persistent max-width="600">
          <!-- <v-btn color="primary" dark slot="activator">Open Dialog</v-btn> -->
          <v-card class="modalStyle">
            <v-card-title class="display-2">Start new game called "{{newGameName}}"?</v-card-title>
            <!-- <h2 class="display-1 playerName">{{newName}}?</h2> -->
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="redButton centerButton" @click.native="dialog = false">Wait, nevermind</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="yellow centerButton" @click="confirmGame">Confirm</v-btn>
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
    props: ['gameName', 'game_id', 'username'],
    created () {
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
        this.validateTrue = false
        if (this.newGameName === '') {
          //can't be a blank game name;
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
        if(this.newGameName === 'New Game' || this.newGameName === "First Game" || this.newGameName === 'Test') {
          this.errMessage =`"${this.newGameName}" is not a valid game name. Please enter a new game name.`;
          this.validateTrue = true;
          this.newGameName = '';
          return
        }
        this.dialog = true;
      },
      confirmGame: function() {
        axios.post('http://localhost:3000/game', {auth_id: this.id, game_name: this.newGameName})
            .then((response) => {
              //seeing if there is any err code in the returned data
              // console.log(response.data.code);
              if(response.data.code) {
                console.log('some information is wrong');
              } else {
                //check, may not need this second call here
                axios.post('http://localhost:3000/gameid', {auth_id: this.id})
                .then((response) => {
                  console.log(response.data[0]);
                  let gameId = response.data[0].game_id
                  //capturing as global variables
                  this.$emit('captureGameId', response.data[0].game_id)
                  this.$emit('captureGameName', this.newGameName)
                  axios.post('http://localhost:3000/join', {auth_id: this.id, game_id: gameId, username: this.username})
                    .then((response) => {
                      console.log(response);
                        this.$router.push('/currentgame')
                    })
                    .catch((error) => {
                      console.log(error);
                    })
                  //   creating a route for individual game.  remember to go back and userproof game create to not duplicate two game names and open at same time
                  // let tempName = response.data[0].game_name.split(' ').join('_')
                  // console.log(tempName);
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
