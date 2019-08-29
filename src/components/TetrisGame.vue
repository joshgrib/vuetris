<template>
  <div class='tetris-game'>
    <svg
      class='board'
      :style="{height: '100vh'}"
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
  </div>
</template>

<script>
export default {
  name: 'TetrisGame',
  created () {
    this.$store.commit('initState', this.board)
    this.timer()
    this.$store.commit('createSquare')
  },
  computed: {
    board () {
      return this.$store.state.board
    },
    cells () {
      return this.$store.state.cells
    }
  },
  methods: {
    timer () {
      this.$store.commit('nextTick')
      setTimeout(this.timer, this.$store.state.board.tickTimeMs)
    }
  }
}
</script>
