<template>
  <div id="join">
    <h1>{{msg}}</h1>
    <h4>{{username}}</h4>
    <div>
      <label>Enter game name:</label>
      <input type="text" placeholder="gamename" v-model="joinGameName">
      <h3>OR</h3>
      <label>Enter game #: </label>
      <input type="text" placeholder="game id#" v-model="joinGameId">
      <br></br>
      <button @click="joinGame">J o i n</button>
    </div>
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
        joinGameId: ''
      }
    },
    methods: {
      joinGame: function() {
        if (this.joinGameName ==='' && this.joinGameId === '') {
          alert('please enter in a game name or id')
          return
        }
        if (this.joinGameName !== '') {
          axios.post('http://localhost:3000/joingamename', {game_name: this.joinGameName})
          .then((response) => {
            console.log(response);
            if(response.data.length === 0) {
              console.log('not a valid game name. try reentering or use game id');
              return
            };
            axios.post('http://localhost:3000/join', {auth_id: this.id, game_id: response.data[0].game_id, username: this.username})
            .then((response) => {
              console.log(response.data);
              if(response.data.code  === 'ER_DUP_ENTRY') {
                alert('Were sorry but it looks like you have already joined the game')
              }
              else if(response.data === 'success'){
                alert('joined successfully')
                console.log('joined game successfully');
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
              alert('Were sorry but it looks like you have already joined the game')
            }
            else if(response.data === 'success'){
              alert('joined successfully')
              console.log('joined game successfully');
            }
            else {
              console.log('something wrong. contact administrator');
            }
          })
          .catch((err) => {
            console.log(err);
          })
        }
      }
      }
  }

</script>
