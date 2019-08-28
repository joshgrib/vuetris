import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cells: []
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
            fill: 'lightgrey'
          })
        }
        state.cells.push(row)
      }
    },
    createSquare (state) {
      let color = 'yellow'
      state.cells[0][0].fill = color
      state.cells[0][1].fill = color
      state.cells[1][0].fill = color
      state.cells[1][1].fill = color
    }
  },
  actions: {}
})
