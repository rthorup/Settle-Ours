<template>
  <div id="createGame">
    <h1>{{msg}}</h1>
    <label>Enter a game name</label>
    <input type='text' v-model="newGameName" placeholder="Game Name"/>
    <br></br>
    <button @click="submitGame">Create Game</button>
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
      // this.name = this.$root.username
    },
    data() {
      return {
        msg: "Create a new game",
        newGameName: '',
        id: '',
      }
    },
    methods: {
      submitGame: function () {
        if (this.newGameName === '') {
          //can't be a blank game name
          alert('Please insert a game name')
        } else {
        alert(`Are you sure you want to create a new game called ${this.newGameName}`)
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
  }

</script>
