<!-- page that shows users past games -->
<template>
  <div id="stats">
    <h1 class="display-2 mt-0 pa-4">{{msg}}</h1>
    <div class="validateError" v-if="validateTrue">
      <h2 clas="display-3">{{errMessage}}</h2>
    </div>
    <div class="gameList">
      <div class="gameUser">
        <h2 class="display-1 pa-1 ma-1 fullWidth">Hello, {{username}}!</h2>
        <h2 class="display-1 pa-1 ma-1 fullWidth">You have won {{firstPlaces}} games out of a total of {{totalGames}}</h2>
      </div>
    </div>
    <div>
      <table class="statsTable">
        <tr class="tableHeader">
          <th class="pa-2">Game ID</th>
          <th class="pa-2">Score</th>
          <th class="pa-2">Place</th>
        </tr>
        <tr v-for="(stat, index) in stats" @click="viewGame(stat.game_id)" class="hoverData">
          <td class="pa-2">{{stat.game_id}}</td>
          <td class="pa-2">{{stat.score}}</td>
          <td class="pa-2">{{stat.place}}</td>
        </tr>
      </table>
    <div></div>
    </div>
    <template>
      <v-layout column>
        <v-dialog v-model="dialog" persistent max-width="450">
          <v-card class="modalStyle">
            <!-- Mobile text diplay -->
            <v-card-title class="title mobileWidth">Game Name: {{placeholderGameId}}</v-card-title>
            <!-- Normal text display -->
            <h2 class="display-2 fullWidth pa-1">Game Name: {{placeholderGameId}}</h2>
            <table class="resultsTable">
              <tr class="tableHeader">
                <th class="pa-1">Player Name</th>
                <th class="pa-1">Score</th>
                <th class="pa-1">Place</th>
              </tr>
              <tr v-for="stat in gameStats">
                <td class="pa-1">{{stat.username}}</td>
                <td class="pa-1">{{stat.score}}</td>
                <td class="pa-1">{{stat.place}}</td>
              </tr>
            </table>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green centerButton" @click="closeGames">Okay</v-btn>
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
    name: 'Stats',
    props: ['gameName', 'game_id', 'username', 'url'],
    created () {
      //checking for user and making call for user results
      firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.id = user.uid
        axios.post(this.url + '/playerstats', {auth_id: this.id})
        .then((results) => {
          if(results.data.length !==0) {
            this.stats = results.data
            this.totalGames = results.data.length
            let firstPlaces = 0
            for (let x = 0; x < results.data.length; x++) {
              if(x < results.data.length-1) {
              if (results.data[x].place === 1) {
                firstPlaces++
              }
            }
            else {
              this.firstPlaces = firstPlaces
              let number = firstPlaces/results.data.length.toFixed(2)
              this.winPercent = number.toFixed(2)*100;
            }
            }
          }
          else {
            this.errMessage = 'Sorry. There are no recorded games for this user'
            this.validateTrue = true
          }
        })
        .catch((error) =>{
          console.log(error);
        });
      }
      else {
        //redirecting if not logged in
        this.$router.push('/login')
      }
    })
  },
    data() {
      return {
        msg: "Here is your current record",
        id: '',
        test: '',
        stats: [],
        gameStats: ["people", "places", "things"],
        errMessage: '',
        validateTrue: false,
        totalGames: '',
        firstPlaces: '',
        winPercent: '',
        dialog: false,
        placeholderGameId: '',
      }
    },
    methods: {
      viewGame: function(game_id){
        this.dialog = true;
        axios.post(this.url +'/game_stats', {
            game_id: game_id,
          })
          .then((results) => {
            console.log(results.data);
            this.gameStats = results.data;
            this.placeholderGameId = results.data[0].game_name;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      closeGames: function() {
        this.dialog = false;
      }
      }
    }

</script>
