export default {
  data () {
    return {
      started: false,
      paused: false
    }
  },
  methods: {
    sendKeyCode (code, key) {
      document.body.dispatch('keydown', { code })
    },
    registerKeydownListener () {
      document.body.addEventListener('keydown', e => {
        const keyActions = {
          'Space': this.startGame,
          'KeyP': this.pauseGame,
          'ArrowLeft': this.moveLeft,
          'ArrowRight': this.moveRight,
          'ArrowUp': this.hardDrop,
          'ArrowDown': this.softDrop,
          'KeyR': this.rotateBlock,
          'Minus': this.decreaseGameSpeed,
          'Equal': this.increaseGameSpeed
        }
        if (!Object.keys(keyActions).includes(e.code)) {
          console.warn('Unsupported keypress', e)
          return
        }
        keyActions[e.code]()
      })
    },
    startGame () {
      if (!this.started) {
        this.started = true
        this.timer()
        this.$store.commit('createBlock')
      }
    },
    pauseGame () {
      this.paused = !this.paused
    },
    timer () {
      setTimeout(this.timer, this.board.tickTimeMs)
      if (this.paused) return
      if (this.score.gameOver) return
      if (this.currentBlock.active) {
        this.$store.commit('shiftCurrentBlock', {
          rowDiff: 1,
          colDiff: 0
        })
      } else {
        this.$store.commit('clearFilledRows')
        this.$store.commit('createBlock')
      }
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
    },
    rotateBlock () {
      this.$store.commit('rotateCurrentBlock')
    },
    increaseGameSpeed () {
      this.$store.commit('decreaseTick')
    },
    decreaseGameSpeed () {
      this.$store.commit('increaseTick')
    }
  }
}
