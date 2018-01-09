<template>
  <div id="main">
    <h1 class="display-3 ma-3">{{msg}}</h1>
    <div class="logo">
      <div ></div>
      <div class="hexagon">
        <span class="logoSpan">
          <h1 class="images pa-1 ma-1">THIS IS A NEW DIV</h1>
          <h2 class="images pa-1 ma-1">This is a second div</h2>
        </span>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Main',
    data() {
      return {
        msg: "Welcome to Settle-Ours!",
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
