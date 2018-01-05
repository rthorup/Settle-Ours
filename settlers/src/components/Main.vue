<template>
  <div id="main">
    <h1>{{msg}}</h1>
    <h4>{{test}}</h4>
    <input v-model="test" type="text">
    <button @click="change">Click</button>
  </div>
</template>

<script>
  export default {
    name: 'Main',
    data() {
      return {
        msg: "Main page",
        test: '',
      }
    },
    methods: {
      change: function () {
        console.log('working');
        let y = this.test
        let x = y.split(' ').join('_')
        this.test = x
      }
    }
  }

</script>
