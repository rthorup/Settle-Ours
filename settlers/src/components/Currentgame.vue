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
    <div class="gameList ma-2 fullWidth" v-for="(player, index) in players">
      <div class="row">
        <h2 class="gameUser display-2 ma-2 pa-2">{{player.username}}</h2><input class="input score display-2 ma-2 pa-2" v-show="finalize" type="text" v-model="players[index].score"><v-btn v-if="beforeStart" class="yellow btn" @click='deletePlayer(player)'><v-icon>X</v-icon></v-btn>
      </div>
    </div>
    <div class="gameList mobileWidth" v-for="(player, index) in players">
      <div class="row">
        <h2 class="gameUser title ma-2 pa-2">{{player.username}}</h2><input class="input score title ma-2 pa-2" v-show="finalize" type="text" v-model="players[index].score"><v-btn v-if="beforeStart" class="yellow" @click='deletePlayer(player)'>x</v-btn>
      </div>
    </div>
    <br></br>
    <v-btn color="yellow" class="xsButton" v-if="beforeStart" @click="dialog3 = true">Add Player</v-btn>
    <v-btn color="yellow" class="xsButton" v-if="beforeStart" @click="updateLobby">Update Lobby</v-btn>
    <v-btn color="yellow" class="xsButton" v-if="beforeStart" @click="startGame">Start Game</v-btn>
    <v-btn color="yellow" class="xsButton" v-if="afterStart" @click="startScore">Finalize Scores</v-btn>
    <v-btn color="yellow" class="xsButton" v-if="finalize" @click="confirmScore">Confirm Scores</v-btn>
    <br></br>
    <v-btn color="yellow" @click="cancelGame">Cancel Game</v-btn>
    <!-- several different modals below for message handling and verifying -->
    <template>
      <v-layout column>
        <v-dialog v-model="dialog" persistent max-width="650">
          <v-card class="modalStyle">
            <v-card-title class="display-2 fullWidth">{{modalMessage}}</v-card-title>
            <v-card-title class="title mobileWidth">{{modalMessage}}</v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="redButton" @click.native="dialog = false">Wait, nevermind</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="yellow" @click="confirmGameStart">Confirm</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </template>
    <template>
      <v-layout column>
        <v-dialog v-model="dialog2" persistent max-width="650">
          <v-card class="modalStyle">
            <v-card-title class="display-2 fullWidth">{{modalMessage}}</v-card-title>
            <v-card-title class="title mobileWidth">{{modalMessage}}</v-card-title>
            <h2 class="display-2 fullWidth pa-1">{{modalMessage2}}</h2>
            <h2 class="title mobileWidth pa-2">{{modalMessage2}}</h2>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green centerButton" @click="goHome">Okay</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </template>
    <template>
      <v-layout column>
        <v-dialog v-model="dialog3" persistent max-width="650">
          <v-card class="modalStyle">
            <v-card-title class="display-1 yellow fullWidth">Anonymous player data will not be recorded</v-card-title>
            <v-card-title class="title yellow mobileWidth">Anonymous player data will not be recorded</v-card-title>
            <h2 class="display-2 ml-5 pt-3 fullWidth">Enter a player name:</h2>
            <h2 class="title ml-5 pt-3 mobileWidth">Enter a player name:</h2>
            <v-text-field class="input pr-4 pl-4 pb-1 pt-2 mb-4 mt-4" v-model="newPlayer" placeholder="Player Name"> </v-text-field>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="redButton centerButton" @click.native="dialog3 = false, newPlayer = ''">Wait, nevermind</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="green centerButton" @click="addPlayer">Confirm</v-btn>
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
          axios.post('https://settle-ours.herokuapp.com/gameid', {auth_id: this.id})
          .then((response) => {
            //set new variable to use in next call
            let gameId = response.data[0].game_id
            //set the global variables to use both in this component and on page change
            this.$emit('captureGameId', response.data[0].game_id)
            this.$emit('captureGameName', response.data[0].game_name)
          })
          //make a call to the open game to display table on page
          .then((response) => {
            axios.post('https://settle-ours.herokuapp.com/waiting', {game_id: this.game_id})
              .then((response) => {
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
        dialog3: false,
        validateTrue: false,
        errMessage: '',
        modalMessage: '',
        modalMessage2: '',
        newPlayer: ''
      }
    },
    methods: {
      addPlayer: function() {
        this.validateTrue = false
        if (this.newPlayer == '') {
          this.errMessage = 'Sorry. Player\'s name cannot be blank'
          this.validateTrue = true;
          this.dialog3 = false
          this.newPlayer = ''
          return
        }

        if (this.newPlayer.length < 3) {
          this.errMessage = 'Sorry. Player names must be at least 3 characters long'
          this.validateTrue = true;
          this.dialog3 = false;
          this.newPlayer = ''
          return
        }
        //allows game owner to make new player in game.
        axios.post('https://settle-ours.herokuapp.com/addPlayer', {username: this.newPlayer, game_id: this.game_id})
        .then((response) => {
          this.newPlayer = ''
          this.dialog3 = false
          this.updateLobby()
        })
        .catch((error) => {
          console.log(err);
        })
      },
      deletePlayer: function(player) {
        //allows player to delete player from game
        this.validateTrue = false;
        axios.post('https://settle-ours.herokuapp.com/deleteplayerfromgame',{game_id: player.game_id, user_id: player.user_id})
        .then((response) => {
          this.updateLobby()
        })
        .catch((error) => {
          console.log(error);
        })
      },
      updateLobby: function () {
        //updates lobby to check if new players have joined the game
        this.validateTrue = false;
        axios.post('https://settle-ours.herokuapp.com/waiting', {game_id: this.game_id})
          .then((response) => {
            //set the list of players in the data
            this.players = response.data
          })
          .catch((error) => {
            console.log(error);
          })
      },
      startGame: function() {
        //before game starts, checking to see if game meets requirements
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
        //modal to ask user to confirm
        this.modalMessage = 'Are you sure you want to start a new game? Players may not be added once the game has begun.'
        this.dialog = true;
     },
     confirmGameStart: function() {
       //after user confirms, take away all buttons except score, including ability to delete players
        this.beforeStart = !this.beforeStart
        this.afterStart = !this.afterStart
        this.dialog = false;
      },
      startScore: function() {
        // add the score boxes to change score as well as finalize button
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
        for (let x = 0; x < this.players.length; x++) {
          ranker.push(this.players[x])
        }
          axios.post('https://settle-ours.herokuapp.com/inputscore', {ranker})
          .then((response) => {
            if(response.data.code) {
              this.modalMessage = 'Sorry, this game did not record. Please try again. If problem persists, try creating a new game instance'
              this.dialog = true;
            }
            // after input score, this fires to close the game in game_created so owner can make new game
            axios.post('https://settle-ours.herokuapp.com/closeGame', {game_id: this.game_id})
            .then((response) => {
              if(response.data.status === 'success') {
                this.modalMessage2 = `Congratulations! Your game "${this.gameName}" has been recorded. Make sure to check out your new stats!`
                this.dialog2 = true;
              }
              else {
                this.modalMessage2 = `Sorry but ${this.gameName} did not record.  Please try recreating the game instance`
                this.dialog2 = true;
              }
            })
            .catch((err) => {
              console.log(err);
            })
          })
          .catch((err) => {
            console.log(err);
          })
      },
      goHome: function() {
        this.$router.push('/home')
      },
      cancelGame: function() {
        //cancels game by deleting all records of game from tables
        this.modalMessage = ''
        axios.post('https://settle-ours.herokuapp.com/cancelgame', {game_id: this.game_id})
        .then((response) => {
          if(response.data.status === 'success') {
            this.modalMessage2 = 'Your game has successfully been cancelled'
            this.dialog2 = true
          }
          else {
            this.errMessage = 'Sorry. The game was not deleted. Please try again.'
            this.validateTrue = true;
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

</style>
