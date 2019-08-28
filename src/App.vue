<template>
  <div id='app'>
    <button @click='toggle'>Switch</button>
    <section v-if="tetris">
      <tetris-game />
    </section>
    <section v-else>
      <img alt='Vue logo' src='./assets/logo.png' />
      <HelloWorld msg='Welcome to Your Vue.js App' />
    </section>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import TetrisGame from './components/TetrisGame.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    TetrisGame
  },
  data () {
    return {
      tetris: true
    }
  },
  methods: {
    toggle () {
      this.tetris = !this.tetris
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
