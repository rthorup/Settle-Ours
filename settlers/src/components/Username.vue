<template>
  <div id="username">
    <h1>{{msg}}</h1>
    <h1>{{displayName}}</h1>
    <h1>{{username}}</h1>
    <h1>{{id}}</h1>
    <h1>{{warning}}</h1>
      <label>Enter a username</label>
      <br></br>
      <input type="text" v-model="newName" placeholder="Ex: Thorpus Maximus"/>
      </br></br>
      <button @click="submitUser(id)">Okay</button>
  </div>
</template>

<script>
  import firebase from 'firebase';
  import axios from 'axios';
  export default {
    created () {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.displayName = user.displayName;
          this.id = user.uid
          this.email = user.email
          //making a call right away to see if they have a username. if so, move on to the home page
          axios.post('http://localhost:3000/usernamecheck', {auth_id: this.id})
              .then((response) => {
                console.log('call to checkusername made');
                console.log(response.data);
                if (response.data.length !== 0) {
                  console.log(response.data[0].username);
                  // this.$root.username = response.data[0].username
                  this.$emit('captureUserName', response.data[0].username)
                  this.$router.push('/home')
                }
              })
              .catch((error) =>{
                console.log(error);
              });
        }
        else {
          this.$router.push('/login')
        }
      });
    },
    name: 'Username',
    props: ['gameName', 'game_id', 'username'],
    data() {
      return {
        msg: "Username page",
        displayName: '',
        id: '',
        email: '',
        newName: '',
        warning: ''
      }
    },
    methods: {
      submitUser: function (id) {
        // console.log(this.id);
        let thisData = this
        // console.log('working');
        axios.post('http://localhost:3000/username', {auth_id: this.id, email: this.email, username: this.newName})
          .then((response) => {
            if(response.data.status === false) {
            thisData.warning = response.data.message
          } else if (response.data.status === true) {
            this.$router.push('/home')
          }
            console.log(response);
          })
          .catch((error)=> {
            console.log(error);
            console.log('what the fuck are you trying to do?');
          });
      }
    }
  }

</script>
