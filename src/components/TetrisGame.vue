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
            {{ JSON.stringify(cell) }}
          </title>
        </rect>
      </g>
    </svg>
    <hr>
    <button @click="hardDrop">
      Hard drop<br><kbd>[up arrow]</kbd>
    </button>
    <br>
    <button @click="moveLeft">
      Left<br><kbd>[left arrow]</kbd>
    </button>
    <button @click="moveRight">
      Right<br><kbd>[right arrow]</kbd>
    </button>
    <br>
    <button @click="softDrop">
      Soft drop<br><kbd>[down arrow]</kbd>
    </button>
    <hr>
    <button @click="startGame">
      Start<br><kbd>[space]</kbd>
    </button>
    <button @click="pauseGame">
      Pause<br><kbd>[p]</kbd>
    </button>
  </div>
</template>

<script>
import tetrisControls from './tetrisControls.mixin.js'

export default {
  name: 'TetrisGame',
  mixins: [tetrisControls],
  created () {
    this.$store.commit('initState', this.board)
    this.registerKeydownListener()
  },
  computed: {
    board () {
      return this.$store.state.board
    },
    cells () {
      return this.$store.state.cells
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
