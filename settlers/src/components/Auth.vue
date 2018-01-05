<template>
  <div id="auth">
    <h1>{{msg}}</h1>
    <h1>HERE WE ARE</h1>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import firebaseui from 'firebaseui'
  import {config} from '../connection/config.js'
  export default {
    name: 'Auth',
    mounted() {
    var uiConfig = {
      signInSuccessUrl: '/username',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
        ]
      };
      if(this.$root.ui!=''){
        this.$root.ui.reset()
      }else{
        this.$root.ui = new firebaseui.auth.AuthUI(firebase.auth());
      }
      this.$root.ui.start('#firebaseui-auth-container', uiConfig);
    },
    data() {
      return {
        msg: "Auth page"
      }
    }
  }

</script>
