<!-- login page for app. uses firebase auth -->
<template>
  <div class="auth" id="auth">
    <h1 class="display-4 pa-5 fullWidth">Please login to begin!</h1>
    <h1 class="display-2 pa-2 mt-5 mb-5 mobileWidth">Please login to begin!</h1>
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
      //firebase auth magic.
    var uiConfig = {
      signInSuccessUrl: '/home',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
        ]
      };
      //checking to see if there is a ui already. if there is, set it to blank to restart a new ui instance
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
