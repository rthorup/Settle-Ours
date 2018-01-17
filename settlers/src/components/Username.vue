<template>
  <div class="spacer" id="username">
        <h1 class="display-3 pt-5 fullWidth">{{msg}}</h1>
        <h1 class="display-1 pt-5 pr-1 pl-1 mobileWidth">{{msg}}</h1>
        <br></br>
        <!-- div to handle errors -->
        <div class="validateError" v-if="validateTrue">
          <h2 clas="display-3">{{errMessage}}</h2>
        </div>
        <v-text-field class="input pr-4 pl-4 pb-0" v-model="newName" placeholder="Ex: Thorpus Maximus"> </v-text-field>
        </br></br>
        <v-btn class="yellow"  @click="submitUser(id)">Okay</v-btn>
        <template>
          <v-layout column>
            <v-dialog v-model="dialog" persistent max-width="490">
              <v-card class="modalStyle">
                <v-card-title class="display-1">Your new username is:</v-card-title>
                <h2 class="display-1 pb-2">{{newName}}</h2>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="redButton centerButton ma-1 pa-2" @click.native="dialog = false">Wait, nevermind</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="yellow centerButton ma-1 pa-2" @click="confirmUser(id)">Confirm</v-btn>
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
        console.log(user);
        if (user) {
          console.log('user found');
          this.displayName = user.displayName;
          this.id = user.uid
          this.email = user.email
          //making a call right away to see if they have a username. if so, move on to the home page
          axios.post('https://settle-ours.herokuapp.com/usernamecheck', {auth_id: this.id})
              .then((response) => {
                if (response.data.length !== 0) {
                  this.$emit('captureUserName', response.data[0].username)
                  this.$router.push('/home')
                }
              })
              .catch((error) =>{
                console.log(error);
              });
        }
        else {
          console.log('no user?');
          
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
        //checking for some criteria
        this.validateTrue = false;
        let thisData = this
        if (this.newName === '') {
          this.errMessage = "Username cannot be blank."
          this.validateTrue = true
          return
        }
        if (this.newName.length < 3) {
          this.errMessage = "Username must be longer than 3 characters."
          this.validateTrue = true
          return
        }
        this.dialog = true;
      }
        ,
        confirmUser: function (id) {
        //modal to make sure user wants the username and is correct
        let thisData = this
        axios.post('https://settle-ours.herokuapp.com/username', {auth_id: this.id, email: this.email, username: this.newName})
          .then((response) => {
            if(response.data.status === false) {
            this.dialog = false;
            this.errMessage = response.data.message
            this.validateTrue = true
          } else if (response.data.status === true) {
            this.$router.push('/home')
          }
          })
          .catch((error)=> {
            this.errMessage = "Sorry but we could not record your username. Please try a different username"
            this.validateTrue = true
          });
        }
      }
  }
</script>
