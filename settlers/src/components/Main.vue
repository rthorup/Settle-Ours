<!-- main landing page with about section -->
<template>
  <div class="auth" id="main">
    <h1 class="display-4 pt-5 mb-5 fullWidth">{{msg}}</h1>
    <h1 class="display-2 pt-5 mb-5 mobileWidth">{{msg}}</h1>
    <div class="logoSpan">
      <v-btn @click="login" class="yellow images mt-5">Login</v-btn>
      <v-btn @click="about" class="yellow images ma-2">About</v-btn>
    </div>
    <template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"><h2>What is Settle-Ours all about?</h2></span>
        </v-card-title>
        <v-card-text class="title about">
          <h2 class="about pb-2"><b>It's about being the best</b></h2>
          <p class="about">Ever had those arguments with family or friends about who is the best Settlers player?  Well now you don't have to! Settle-Ours settles all your disputes by tracking your games and scores so everyone will know you are the best, because data and all that....</p>
          <h2 class="about pb-2"><b>How does it work?</b></h2>
          <p class="about">It's easy! Each time you start a new Settlers game, simply create a new game instance and share that game name or id with your fellow gamers to join.  Once everyone is in the game lobby, start the game and when you're finished finalize the scores. Then all that is left is to check the stats!</p>
          <h2 class="about pb-2"><b>What if the game-owner puts in the wrong scores</b></h2>
          <p class="about">That game owner is a bad person. Everyone should throw rotten fruit and vegetables at them and then never let them keep score again.</p>
          <h2>Happy gaming friends!</h2>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="yellow" @click="dialog = false">Game on</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
  </div>
</template>

<script>
  export default {
    name: 'Main',
    data() {
      return {
        msg: "Welcome to Settle-Ours!",
        test: '',
        dialog: false
      }
    },
    methods: {
      login: function() {
        this.$router.push('/login')
      },
      about: function() {
        this.dialog = true;
      }
    }
  }

</script>
