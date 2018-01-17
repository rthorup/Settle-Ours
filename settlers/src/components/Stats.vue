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
        <h2 class="display-1 pa-1 ma-1 fullWidth">Win percentage: {{winPercent}}%!</h2>
        <h2 class="title pa-1 ma-1 mobileWidth">Hello, {{username}}!</h2>
        <h2 class="title pa-1 ma-1 mobileWidth">You have won {{firstPlaces}} games out of a total of {{totalGames}}</h2>
        <h2 class="title pa-1 ma-1 mobileWidth">Win percentage: {{winPercent}}%!</h2>
      </div>
    </div>
    <div>
      <table class="statsTable">
        <tr class="tableHeader">
          <th class="pa-2">Game ID</th>
          <th class="pa-2">Score</th>
          <th class="pa-2">Place</th>
        </tr>
        <tr v-for="stat in stats">
          <td class="pa-2">{{stat.game_id}}</td>
          <td class="pa-2">{{stat.score}}</td>
          <td class="pa-2">{{stat.place}}</td>
        </tr>
      </table>
    <div></div>
    </div>
  </div>
</template>
<script>

import firebase from 'firebase'
import axios from 'axios'

  export default {
    name: 'Stats',
    props: ['gameName', 'game_id', 'username'],
    created () {
      //checking for user and making call for user results
      firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.id = user.uid
        axios.post('https://settle-ours.herokuapp.com/playerstats', {auth_id: this.id})
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
        errMessage: '',
        validateTrue: false,
        totalGames: '',
        firstPlaces: '',
        winPercent: ''
      }
    },
    methods: {

      }
    }

</script>
