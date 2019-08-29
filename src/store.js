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

const isOpenPosition = (coords, cells) => {
  for (let coord of coords) {
    let [row, col] = coord
    if (cells[row] === undefined) return false
    if (cells[row][col] === undefined) return false
    /* FIXME:
    this will overwrite previous inactiveblocks, need to
    somehow check if the block is colored and in a final
    position to know if all coords are open
     */
  }
  return true
}

const fillColor = (state, coords, color) => {
  coords.map(([row, col]) => {
    if (state.cells[row] === undefined) {
      console.warn(`Unable to find row ${row}`)
      return
    }
    if (state.cells[row][col] === undefined) {
      console.warn(`Unable to find cell [${row}, ${col}]`)
      return
    }
    state.cells[row][col].fill = color
  })
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
    }
  },
  mutations: {
    initState (state) {
      state.cells.length = 0
      for (let i = 0; i < state.board.height; i++) {
        let row = []
        for (let j = 0; j < state.board.width; j++) {
          row.push({
            width: state.board.cellSize - 1,
            height: state.board.cellSize - 1,
            fill: state.board.background
          })
        }
        state.cells.push(row)
      }
    },
    createSquare (state) {
      let centerPoint = [0, 0]
      let coords = getCoordArray(centerPoint, 'square')
      state.currentBlock.coords = coords
      state.currentBlock.color = 'yellow'
      state.currentBlock.active = true
      fillColor(state, state.currentBlock.coords, state.currentBlock.color)
    },
    shiftCurrentBlock (state, { rowDiff, colDiff }) {
      let newCoords = []
      state.currentBlock.coords.map(([row, col]) => {
        newCoords.push([row + rowDiff, col + colDiff])
      })
      if (isOpenPosition(newCoords, state.cells)) {
        fillColor(state, state.currentBlock.coords, state.board.background)
        state.currentBlock.coords = newCoords
        fillColor(state, state.currentBlock.coords, state.currentBlock.color)
      } else {
        if (rowDiff === 1) {
          // only set inactive if the block was trying to move down
          state.currentBlock.active = false
        }
      }
    }
  }
})
