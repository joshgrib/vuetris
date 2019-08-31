<template>
  <div class='tetris-game'>
    <svg
      class='board'
      :style="boardStyle"
    >
      <g
        v-for="(row, rowIdx) in cells"
        :key="`row-${rowIdx}`"
        :data-row-idx="rowIdx"
      >
        
        <rect
          v-for="(cell, colIdx) in row"
          v-bind="cell"
          :title="JSON.stringify(cell)"
          :key="`col-${colIdx}`"
          :x="`${colIdx * board.cellSize}`"
          :y="`${rowIdx * board.cellSize}`"
        >
          <title>
            {{ JSON.stringify({...cell, rowIdx, colIdx}) }}
          </title>
        </rect>
      </g>
    </svg>
    <hr>
    <button @click="sendKeyCode('ArrowUp')">
      Hard drop<br><kbd>[up arrow]</kbd>
    </button>
    <button @click="sendKeyCode('KeyR')">
      Rotate<br><kbd>[r]</kbd>
    </button>
    <br>
    <button @click="sendKeyCode('ArrowLeft')">
      Left<br><kbd>[left arrow]</kbd>
    </button>
    <button @click="sendKeyCode('ArrowRight')">
      Right<br><kbd>[right arrow]</kbd>
    </button>
    <br>
    <button @click="sendKeyCode('ArrowDown')">
      Soft drop<br><kbd>[down arrow]</kbd>
    </button>
    <hr>
    <button
      v-if="!started"
      @click="sendKeyCode('Space')"
    >
      Start<br><kbd>[space]</kbd>
    </button>
    <button
      v-if="started"
      @click="sendKeyCode('KeyP')"
    >
      {{ paused ? 'Resume' : 'Pause' }}<br><kbd>[p]</kbd>
    </button>
    <br>
    <button @click="sendKeyCode('Equal', '+')">
      Faster<br><kbd>[+]</kbd>
    </button>
    <button @click="sendKeyCode('Minus')">
      Slower<br><kbd>[-]</kbd>
    </button>
    <hr>
    <h4>Score: {{ totalScore }}</h4>
    <p>Rows cleared: {{ score.rowsCleared }}</p>
    <p>Blocks placed: {{ score.blocksPlaced }}</p>
  </div>
</template>

<script>
import tetrisControls from './tetrisControls.mixin.js'

export default {
  name: 'TetrisGame',
  mixins: [tetrisControls],
  created () {
    this.$store.commit('initState')
    this.registerKeydownListener()
  },
  computed: {
    board () {
      return this.$store.state.board
    },
    cells () {
      return this.$store.state.cells
    },
    currentBlock () {
      return this.$store.state.currentBlock
    },
    score () {
      return this.$store.state.score
    },
    totalScore () {
      const placementPoints = this.score.blocksPlaced * 10
      const rowClearPoints = this.score.rowsCleared * 100
      return placementPoints + rowClearPoints
    },
    boardStyle () {
      return {
        height: `${this.board.cellSize * this.board.height}px`,
        width: `${this.board.cellSize * this.board.width}px`
      }
    }
  }
}
</script>
