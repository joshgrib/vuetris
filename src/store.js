import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/* rotation
[
  [0, -1], [0, 0], [0, 1], [0, 2]
] => [
  [-1, 0], [0, 0], [1, 0], [2, 0]
] => [
  [0, 1], [0, 0], [0, -1], [0, -2]
] => [
  [1, 0], [0, 0], [-1, 0], [-2, 0]
] => (start)
*/

const BLOCKS = [
  {
    name: 'square',
    color: 'gold',
    coordMap: [[0, 0], [1, 0], [0, 1], [1, 1]]
  }, {
    name: 'line',
    color: 'royalblue',
    coordMap: [[0, -1], [0, 0], [0, 1], [0, 2]]
  }, {
    name: 'z',
    color: 'crimson',
    coordMap: [[0, -1], [0, 0], [1, 0], [1, 1]]
  }, {
    name: 's',
    color: 'orange',
    coordMap: [[0, 0], [0, 1], [1, 0], [1, -1]]
  }, {
    name: 't',
    color: 'rebeccapurple',
    coordMap: [[0, 0], [0, 1], [0, -1], [1, 0]]
  }, {
    name: 'L',
    color: 'blue',
    coordMap: [[-1, 0], [0, 0], [1, 0], [1, 1]]
  }, {
    name: 'backL',
    color: 'pink',
    coordMap: [[-1, 0], [0, 0], [1, 0], [1, -1]]
  }
]

const isOpenPosition = (coords, cells) => {
  for (let coord of coords) {
    let [row, col] = coord
    if (cells[row] === undefined) return false
    if (cells[row][col] === undefined) return false
    if (cells[row][col].taken) return false
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

const getBlankRow = state => {
  let row = []
  for (let i = 0; i < state.board.width; i++) {
    row.push({
      width: state.board.cellSize - 1,
      height: state.board.cellSize - 1,
      fill: state.board.background,
      taken: false
    })
  }
  return row
}

const clearBoard = state => {
  state.cells.length = 0
  for (let i = 0; i < state.board.height; i++) {
    const newRow = getBlankRow(state)
    state.cells.push(newRow)
  }
}

const getRandomInt = maxVal => {
  return Math.floor(Math.random() * Math.floor(maxVal))
}

const rotate = (coordMap, count) => {
  // FIXME: this 'flips' more than it 'rotates'
  if (count === 0) return coordMap
  let newCoords = coordMap.map(([row, col]) => {
    return (count % 2) ? [(-col), (-row)] : [col, row]
  })
  console.log({ coordMap, newCoords })
  return rotate(newCoords, count - 1)
}

const getCurrentBlockCoords = state => {
  const { shape, center, rotateCount } = state.currentBlock
  const coordMap = rotate(shape.coordMap, rotateCount)
  const [rowDiff, colDiff] = center
  return coordMap.map(([row, col]) => [row + rowDiff, col + colDiff])
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
      color: 'orange',
      shape: undefined,
      rotateCount: 0,
      center: []
    },
    score: {
      rowsCleared: 0,
      blocksPlaced: 0,
      gameOver: false
    }
  },
  mutations: {
    initState (state) {
      clearBoard(state)
      state.score.rowsCleared = 0
    },
    createBlock (state) {
      const initCol = Math.floor((state.board.width - 1) / 2)
      if (state.cells[0][initCol].taken) {
        state.score.gameOver = true
        return
      }
      const idx = getRandomInt(BLOCKS.length)
      const newShape = BLOCKS[idx]
      state.currentBlock.shape = newShape
      state.currentBlock.center = [0, initCol]
      state.currentBlock.color = newShape.color
      state.currentBlock.active = true
      const coords = getCurrentBlockCoords(state)
      fillColor(state, coords, state.currentBlock.color)
    },
    shiftCurrentBlock (state, { rowDiff, colDiff }) {
      const newCoords = getCurrentBlockCoords(state).map(([row, col]) => {
        return [row + rowDiff, col + colDiff]
      })
      if (isOpenPosition(newCoords, state.cells)) {
        fillColor(state, getCurrentBlockCoords(state), state.board.background)
        state.currentBlock.center[0] += rowDiff
        state.currentBlock.center[1] += colDiff
        fillColor(state, getCurrentBlockCoords(state), state.currentBlock.color)
      } else {
        // only set inactive if the block was trying to move down
        if (rowDiff === 1) {
          state.score.blocksPlaced++
          state.currentBlock.active = false
          state.currentBlock.rotateCount = 0
          getCurrentBlockCoords(state).map(([row, col]) => {
            state.cells[row][col].taken = true
          })
        }
      }
    },
    rotateCurrentBlock (state) {
      if (!state.currentBlock.active) return
      const { shape, center, rotateCount } = state.currentBlock
      const [rowDiff, colDiff] = center
      const newCoords = rotate(shape.coordMap, rotateCount + 1).map(([r, c]) => [r + rowDiff, c + colDiff])
      if (isOpenPosition(newCoords, state.cells)) {
        fillColor(state, getCurrentBlockCoords(state), state.board.background)
        state.currentBlock.rotateCount++
        fillColor(state, newCoords, state.currentBlock.color)
      }
    },
    clearFilledRows (state) {
      let toClear = []
      state.cells.map((row, idx) => {
        const takenCells = row.filter(r => r.taken)
        if (row.length === takenCells.length) {
          toClear.push(idx)
        }
      })
      for (let idx of toClear) {
        state.cells.splice(idx, 1)
        state.score.rowsCleared++
        const newRow = getBlankRow(state)
        state.cells.unshift(newRow)
      }
    },
    increaseTick (state) {
      state.board.tickTimeMs = state.board.tickTimeMs * 1.25
    },
    decreaseTick (state) {
      state.board.tickTimeMs = state.board.tickTimeMs * 0.75
    }
  }
})
