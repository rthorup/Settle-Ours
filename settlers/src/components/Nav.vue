<template>
  <div id="main">
    <v-container>
      <v-layout>
        <v-flex>{{username}}</v-flex>
        <v-flex>Logout</v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import firebase from 'firebase'
  export default {
    name: 'Nav',
    props: ['gameName', 'game_id', 'username'],
    data() {
      return {
        msg: "nav page",
      }
    },
    methods: {
      logout: function() {
        console.log('working');
        firebase.auth().signOut();
        this.username = ''
        this.game_id = ''
        this.$router.push('/login')
      },
    }
    }
</script>
