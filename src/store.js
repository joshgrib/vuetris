import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const getCoordArray = (centerCoord, shape) => {
  let [row, col] = centerCoord
  if (shape === 'square') {
    return [
      [row, col],
      [row + 1, col],
      [row, col + 1],
      [row + 1, col + 1]
    ]
  }
}

const isInBounds = (coords, board) => {
  coords.map(([row, col]) => {
    const rowInBounds = row > 0 && row <= board.height
    const colInBounds = col > 0 && col <= board.width
    const bothInBounds = rowInBounds && colInBounds
    if (!bothInBounds) return false
  })
  return true
}

const fillColor = (state, coords, color) => {
  coords.map(([row, col]) => {
    state.cells[row][col].fill = color
  })
}

const moveBlockDown = state => {
  let coords = state.currentBlock.coords
  let shiftedDown = coords.map(([row, col]) => [row + 1, col])
  if (isInBounds(shiftedDown, state.board)) {
    fillColor(state, coords, state.board.background)
    state.currentBlock.coords = shiftedDown
    fillColor(state, state.currentBlock.coords, state.currentBlock.color)
  }
}

export default new Vuex.Store({
  state: {
    cells: [],
    board: {
      width: 10,
      height: 20,
      cellSize: 15,
      background: 'lightgrey',
      tickTimeMs: 500
    },
    currentBlock: {
      active: false,
      color: 'red',
      coords: []
    },
    tickCount: 0
  },
  mutations: {
    initState (state, { height, width, cellSize }) {
      state.cells.length = 0
      for (let i = 0; i < height; i++) {
        let row = []
        for (let j = 0; j < width; j++) {
          row.push({
            width: cellSize - 1,
            height: cellSize - 1,
            fill: state.board.background
          })
        }
        state.cells.push(row)
      }
    },
    nextTick (state) {
      state.tickCount++
      if (state.currentBlock.active) {
        moveBlockDown(state)
      }
      console.log(state.tickCount)
    },
    createSquare (state) {
      let centerPoint = [0, 0]
      let coords = getCoordArray(centerPoint, 'square')
      state.currentBlock.coords = coords
      state.currentBlock.color = 'yellow'
      state.currentBlock.active = true
      fillColor(state, state.currentBlock.coords, state.currentBlock.color)
    }
  },
  actions: {}
})
