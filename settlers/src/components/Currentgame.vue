<template>
  <div id="main">
    <v-container>
      <v-layout column>
        <div>
          <h1 class="display-1" v-if="beforeStart">Game Name: {{gameName}}</h1>
          <h1 class="display-1" v-if="beforeStart">Game ID: {{game_id}}</h1>
        </div>
      </v-layout>
      <div class="validateError" v-if="validateTrue">
        <h2 clas="display-3">{{errMessage}}</h2>
      </div>
    </v-container>
    <div class="gameList ma-2" v-for="(player, index) in players">
      <div class="row">
        <h2 class="gameUser display-2 ma-2 pa-2">{{player.username}}</h2><input class="input score display-2 ma-2 pa-2" v-show="finalize" type="text" v-model="players[index].score"><v-btn v-if="beforeStart" class="yellow" @click='deletePlayer(player)'><v-icon>X</v-icon></v-btn>
      </div>
    </div>
    <br></br>
    <v-btn color="yellow" v-if="beforeStart" @click="updateLobby">Update Lobby</v-btn>
    <v-btn color="yellow" v-if="beforeStart" @click="startGame">Start Game</v-btn>
    <v-btn color="yellow" v-if="afterStart" @click="startScore">Finalize Scores</v-btn>
    <v-btn color="yellow" v-if="finalize" @click="confirmScore">Confirm Scores</v-btn>
    <br></br>
    <v-btn color="yellow" @click="cancelGame">Cancel Game</v-btn>
    <template>
      <v-layout column>
        <v-dialog v-model="dialog" persistent max-width="650">
          <!-- <v-btn color="primary" dark slot="activator">Open Dialog</v-btn> -->
          <v-card class="modalStyle">
            <v-card-title class="display-2">{{modalMessage}}
            </v-card-title>
            <!-- <h2 class="display-1 playerName">Players may not be added once the game has begun.</h2> -->
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="redButton centerButton" @click.native="dialog = false">Wait, nevermind</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="yellow centerButton" @click="confirmGameStart">Confirm</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </template>
    <template>
      <v-layout column>
        <v-dialog v-model="dialog2" persistent max-width="650">
          <!-- <v-btn color="primary" dark slot="activator">Open Dialog</v-btn> -->
          <v-card class="modalStyle">
            <v-card-title class="display-2">{{modalMessage}}
            </v-card-title>
            <h2 class="display-2">{{modalMessage2}}</h2>
            <!-- <h2 class="display-1 playerName">Players may not be added once the game has begun.</h2> -->
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green centerButton" @click="goHome">Okay</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </template>
  </div>
</template>

<script>
  import firebase from 'firebase';
  import axios from 'axios'
  export default {
    name: 'Main',
    props: ['gameName', 'game_id', 'username'],
    created () {
      //always on page load to get the users id
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          //set the user id
          this.id = user.uid
          //make a call to see which game is open on the users account
          axios.post('http://localhost:3000/gameid', {auth_id: this.id})
          .then((response) => {
            //just to show what data i'm getting...delete later
            // console.log(response.data[0]);
            //set new variable to use in next call
            let gameId = response.data[0].game_id
            //set the global variables to use both in this component and on page change
            this.$emit('captureGameId', response.data[0].game_id)
            this.$emit('captureGameName', response.data[0].game_name)
          })
          //make a call to the open game to display table on page
          .then((response) => {
            axios.post('http://localhost:3000/waiting', {game_id: this.game_id})
              .then((response) => {
                //double check the data returned
                // console.log(response.data);
                //set the list of players in the data
                this.players = response.data
              })
              .catch((error) => {
                console.log(error);
              })
          })
          .catch((error) => {
            console.log(error);
          })
        }
        else {
          //if not already logged in, make them login through user page
          this.$router.push('/login')
        }
      });
    },
    data() {
      return {
        msg: "Current Game:",
        id: '',
        players: [],
        finalize: false,
        beforeStart: true,
        afterStart: false,
        scores: '',
        dialog: false,
        dialog2: false,
        validateTrue: false,
        errMessage: '',
        modalMessage: '',
        modalMessage2: ''
      }
    },
    methods: {
      deletePlayer: function(player) {
        this.validateTrue = false;
        console.log(player.game_id);
        console.log(player.user_id);
        axios.post('http://localhost:3000/deleteplayerfromgame',{game_id: player.game_id, user_id: player.user_id})
        .then((response) => {
          console.log(response);
          this.updateLobby()
        })
        .catch((error) => {
          console.log(error);
        })
      },
      updateLobby: function () {
        this.validateTrue = false;
        console.log('working');
        axios.post('http://localhost:3000/waiting', {game_id: this.game_id})
          .then((response) => {
            //double check the data returned
            console.log(response.data);
            //set the list of players in the data
            this.players = response.data
          })
          .catch((error) => {
            console.log(error);
          })
      },
      startGame: function() {
        this.validateTrue = false
        if(this.players.length < 3) {
          this.errMessage = 'Sorry. You need at least three players to start a game'
          this.validateTrue = true;
          return
        }
        if(this.players.length > 6) {
          this.errMessage = 'Sorry. You can have a maximum of 6 players. Please remove one player from the game.'
          this.validateTrue = true;
        }
        this.modalMessage = 'Are you sure you want to start a new game? Players may not be added once the game has begun.'
        this.dialog = true;
     },
     confirmGameStart: function() {
        this.beforeStart = !this.beforeStart
        this.afterStart = !this.afterStart
        this.dialog = false;
      },
      startScore: function() {
        this.afterStart = !this.afterStart
        this.finalize = !this.finalize
      },
      confirmScore: function() {
        this.validateTrue = false;
        //looping through to make sure they have inputed scores correctly
        for(let x = 0; x < this.players.length; x++) {
        if(this.players[x].score === '') {
          this.errMessage = `${this.players[x].username}'s score is empty. Please enter a valid score between 2-14`;
          this.validateTrue = true;
          return
        }
        if(this.players[x].score < 2 || this.players[x].score > 14) {
          this.errMessage = `${this.players[x].username} does not have a valid score.  Please enter score between 2-14`;
          this.validateTrue = true;
          return
        }
        if(isNaN(this.players[x].score)) {
          this.errMessage = `${this.players[x].username}'s score is not a number. please enter a number (no text)`;
          this.validateTrue = true;
          return
        }
      }
      //putting users into an array to send them through axios call
        let ranker = []
        this.modalMessage = ''
        // let this = this
        for (let x = 0; x < this.players.length; x++) {
          ranker.push(this.players[x])
        }
          axios.post('http://localhost:3000/inputscore', {ranker})
          .then((response) => {
            console.log(response);
            if(response.data.code) {
              this.modalMessage = 'Sorry, this game did not record. Please try again. If problem persists, try creating a new game instance'
              this.dialog = true;
            }
            axios.post('http://localhost:3000/closeGame', {game_id: this.game_id})
            .then((response) => {
              if(response.data.status === 'success') {
                this.modalMessage2 = `Congratulations! Your game ${this.gameName} has been recorded. Make sure to check out your new stats!`
                this.dialog2 = true;
                // this.$router.push('/home')
              }
              else {
                this.modalMessage2 = `Sorry but ${this.gameName} did not record.  Please try recreating the game instance`
                this.dialog2 = true;
                // this.$router.push('/home')
              }
            })
            .catch((err) => {
              console.log(err);
            })
          })
          .catch((err) => {
            console.log(err);
            console.log('this is where the error is');
          })
      },
      goHome: function() {
        this.$router.push('/home')
      },
      cancelGame: function() {
        console.log('cancelling!');
        console.log(this.game_id);
        axios.post('http://localhost:3000/cancelgame', {game_id: this.game_id})
        .then((response) => {
          if(response.data.status === 'success') {
            console.log('game deleted');
          }
          else {
            console.log('game not delted');
          }
        })
        .catch((err) => {
          console.log(err);
        })
      }
    },
  }

</script>
<style>
  .row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
</style>
