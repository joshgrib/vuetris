<template>
  <div class='tetris-game'>
    <p>Board</p>
    <svg 
      class='board'
      :style="{height: '100vh'}"
    >
      <g
        v-for="(row, rowIdx) in $store.state.cells"
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
  data () {
    return {
      board: {
        width: 10,
        height: 20,
        cellSize: 15
      }
    }
  },
  created () {
    this.$store.commit('initState',this.board);
    this.$store.commit('createSquare')
  }
}
</script>
