<template>
  <div id="main">
    <h1>{{msg}}</h1>
    <h3>Game Name: {{gameName}}</h3>
    <h3>Game ID: {{game_id}}</h3>
    <div class="gameList" v-for="(player, index) in players">
      <div class="row">
      <h1>{{player.username}}</h1><h2 v-if="finalize">Score: </h2><input v-show="finalize" type="text" v-model="players[index].score"><button v-if="beforeStart" @click='deletePlayer(player)'>X</button>
      </div>
    </div>
    <br></br>
    <button v-if="beforeStart" @click="updateLobby">Update Lobby</button>
    <button v-if="beforeStart" @click="startGame">Start Game</button>
    <button v-if="afterStart" @click="startScore">Finalize Scores</button>
    <button v-if="finalize" @click="confirmScore">Confirm Scores</button>
    <br></br>
    <button @click="cancelGame">Cancel Game</button>
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
        msg: "Current Game",
        id: '',
        players: [],
        finalize: false,
        beforeStart: true,
        afterStart: false,
        scores: ''
      }
    },
    methods: {
      deletePlayer: function(player) {
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
        // alert('are you sure you want to start a game? no more players can be added after game start.')
        if(this.players.length < 3) {
          console.log('not enought players to start game');
          return
        }
        if(this.players.length > 6) {
          console.log('too many players. only six can play a game');
        }
        this.beforeStart = !this.beforeStart
        this.afterStart = !this.afterStart
      },
      startScore: function() {
        this.afterStart = !this.afterStart
        this.finalize = !this.finalize
      },
      confirmScore: function() {
        for(let x = 0; x < this.players.length; x++) {
        if(this.players[x].score === '') {
          console.log('score cannot be zero');
          return
        }
        if(this.players[x].score < 2 || this.players[x].score > 14) {
        console.log(this.players[x].username + ' does not have a valid score.  Please enter score between 2-14');
        return
        }
        if(isNaN(this.players[x].score)) {
          console.log(this.players[x].score + ' score is not a number. please enter a number (no text)');
          return
        }
      }
        let ranker = []
        for (let x = 0; x < this.players.length; x++) {
          ranker.push(this.players[x])
        }
          axios.post('http://localhost:3000/inputscore', {ranker})
          .then((response) => {
            console.log(response);
            if(response.data.code) {
              console.log('sorry this game did not record. please try again');
            }
            axios.post('http://localhost:3000/closeGame', {game_id: this.game_id})
            .then((response) => {
              if(response.data.status === 'success') {
                console.log('made it to the delete game');
                this.$router.push('/home')
              }
              else {
                console.log('sorry. game did not record. try again and then contact administrator');
                this.$router.push('/home')
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
      cancelGame: function() {
        console.log('cancelling!');
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
