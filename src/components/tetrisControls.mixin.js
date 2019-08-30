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
      if (!this.started) {
        this.started = true
        this.timer()
        this.$store.commit('createSquare')
      }
    },
    pauseGame () {
      this.paused = !this.paused
    },
    timer () {
      if (!this.paused) {
        if (this.currentBlock.active) {
          this.$store.commit('shiftCurrentBlock', {
            rowDiff: 1,
            colDiff: 0
          })
        } else {
          this.$store.commit('createSquare')
        }
      }
      setTimeout(this.timer, this.board.tickTimeMs)
    },
    moveLeft () {
      this.$store.commit('shiftCurrentBlock', {
        rowDiff: 0,
        colDiff: -1
      })
    },
    moveRight () {
      this.$store.commit('shiftCurrentBlock', {
        rowDiff: 0,
        colDiff: 1
      })
    },
    hardDrop () {
      while (this.currentBlock.active) {
        this.$store.commit('shiftCurrentBlock', {
          rowDiff: 1,
          colDiff: 0
        })
      }
    },
    softDrop () {
      this.$store.commit('shiftCurrentBlock', {
        rowDiff: 1,
        colDiff: 0
      })
    }
  }
}
