export default {
  data () {
    return {
      started: false,
      paused: false
    }
  },
  methods: {
    registerKeydownListener () {
      document.body.addEventListener('keydown', e => {
        switch (e.code) {
          case 'Space':
            this.startGame()
            break
          case 'KeyP':
            this.pauseGame()
            break
          case 'ArrowLeft':
            this.moveLeft()
            break
          case 'ArrowRight':
            this.moveRight()
            break
          case 'ArrowUp':
            this.hardDrop()
            break
          case 'ArrowDown':
            this.softDrop()
            break
          default:
            console.warn('Unhandled keydown', e)
        }
      })
    },
    startGame () {
      this.started = true
      this.timer()
      this.$store.commit('createSquare')
    },
    pauseGame () {
      this.paused = !this.paused
    },
    timer () {
      if (!this.paused) {
        this.$store.commit('nextTick')
      }
      setTimeout(this.timer, this.$store.state.board.tickTimeMs)
    },
    moveLeft () {
      console.warn('moveLeft: not implemented')
    },
    moveRight () {
      console.warn('moveRight: not implemented')
    },
    hardDrop () {
      console.warn('hardDrop: not implemented')
    },
    softDrop () {
      console.warn('softDrop: not implemented')
    }
  }
}
