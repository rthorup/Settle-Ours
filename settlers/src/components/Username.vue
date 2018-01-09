<template>
  <div class="spacer" id="username">
        <h1 class="display-3">{{msg}}</h1>
        <!-- <h1>{{displayName}}</h1>
        <h1>{{username}}</h1>
        <h1>{{id}}</h1>
        <h1>{{warning}}</h1> -->
        <br></br>
        <div class="validateError" v-if="validateTrue">
          <h2 clas="display-3">{{errMessage}}</h2>
        </div>
        <v-text-field class="input pr-4 pl-4 pb-0" v-model="newName" placeholder="Ex: Thorpus Maximus"> </v-text-field>
        <!-- <input type="text" v-model="newName" placeholder="Ex: Thorpus Maximus"/> -->
        </br></br>
        <v-btn class="yellow"  @click="submitUser(id)">Okay</v-btn>
        <template>
          <v-layout column>
            <v-dialog v-model="dialog" persistent max-width="490">
              <!-- <v-btn color="primary" dark slot="activator">Open Dialog</v-btn> -->
              <v-card class="modalStyle">
                <v-card-title class="display-1">Your new username is:</v-card-title>
                <h2 class="display-1 playerName">{{newName}}</h2>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="redButton centerButton" @click.native="dialog = false">Wait, nevermind</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="yellow centerButton" @click="confirmUser(id)">Confirm</v-btn>
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
        msg: "Please select a username to proceed",
        // displayName: '',
        id: '',
        email: '',
        newName: '',
        warning: '',
        errMessage: '',
        validateTrue: false,
        dialog: false
      }
    },
    methods: {
      submitUser: function (id) {
        // console.log(this.id);
        this.validateTrue = false;
        let thisData = this
        // console.log('working');
        if (this.newName === '') {
          this.errMessage = "Username cannot be blank."
          this.validateTrue = true
          console.log('please enter a name');
          return
        }
        if (this.newName.length < 3) {
          this.errMessage = "Username must be longer than 3 characters."
          this.validateTrue = true
          // console.log('please enter a name');
          return
        }
        this.dialog = true;
      }
        ,
        confirmUser: function (id) {
        let thisData = this
        axios.post('http://localhost:3000/username', {auth_id: this.id, email: this.email, username: this.newName})
          .then((response) => {
            console.log(response);
            if(response.data.status === false) {
            this.dialog = false;
            this.errMessage = response.data.message
            this.validateTrue = true
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
