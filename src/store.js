import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const BLOCKS = [
  {
    name: 'square',
    color: 'gold',
    coords (row, col) {
      return [
        [row, col],
        [row + 1, col],
        [row, col + 1],
        [row + 1, col + 1]
      ]
    }
  }, {
    name: 'line',
    color: 'royalblue',
    coords (row, col) {
      return [
        [row, col],
        [row, col + 1],
        [row, col + 2],
        [row, col + 3]
      ]
    }
  }, {
    name: 'z',
    color: 'crimson',
    coords (row, col) {
      return [
        [row, col],
        [row, col + 1],
        [row + 1, col + 1],
        [row + 1, col + 2]
      ]
    }
  }, {
    name: 's',
    color: 'orange',
    coords (row, col) {
      return [
        [row, col],
        [row, col + 1],
        [row + 1, col],
        [row + 1, col - 1]
      ]
    }
  }, {
    name: 't',
    color: 'rebeccapurple',
    coords (row, col) {
      return [
        [row, col],
        [row, col + 1],
        [row - 1, col + 1],
        [row + 1, col + 1]
      ]
    }
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

const getBlankRow = (state) => {
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

const clearBoard = (state) => {
  state.cells.length = 0
  for (let i = 0; i < state.board.height; i++) {
    const newRow = getBlankRow(state)
    state.cells.push(newRow)
  }
}

const getRandomInt = maxVal => {
  return Math.floor(Math.random() * Math.floor(maxVal))
}

const clearRow = (state, rowIdx) => {
  state.score.rowsCleared++
  // FIXME: remove the row and shift the rest down instead of just changing the color
  state.cells.map((row, idx) => {
    if (idx === 0) {
      row.map(c => {
        c.taken = false
        c.fill = state.board.background
      })
    } else if (idx >= rowIdx) {
      row.map((c, cellIdx) => {
        c.taken = state.cells[rowIdx - 1][cellIdx].taken
        c.fill = state.cells[rowIdx - 1][cellIdx].fill
      })
    }
  })
  state.cells[rowIdx].map((cell, idx) => {
    cell.taken = false
    cell.fill = 'lightgrey'
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
      color: 'orange',
      coords: []
    },
    score: {
      rowsCleared: 0,
      blocksPlaced: 0
    }
  },
  mutations: {
    initState (state) {
      clearBoard(state)
      state.score.rowsCleared = 0
    },
    createBlock (state) {
      const initCol = Math.floor((state.board.width - 1) / 2)
      const idx = 0//getRandomInt(BLOCKS.length)
      const newShape = BLOCKS[idx]
      state.currentBlock.coords = newShape.coords(0, initCol)
      state.currentBlock.color = newShape.color
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
          state.score.blocksPlaced++
          state.currentBlock.active = false
          state.currentBlock.coords.map(([row, col]) => {
            state.cells[row][col].taken = true
          })
        }
      }
    },
    clearFilledRows (state) {
      let toClear = []
      //TODO: just use normal array methods to filter/split whatever to do this
      // instead of looping over each cell, the whole row can just be shifted
      state.cells.map((row, idx) => {
        const takenCells = row.filter(r => r.taken)
        if (row.length === takenCells.length) {
          toClear.push(idx)
        }
      })
      for(let idx of toClear) {
        state.cells.splice(idx, 1)
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
