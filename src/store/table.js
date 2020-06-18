import { writable } from 'svelte/store'
import { maxCells, maxRows } from './../settings'

function createTable(maxCells, maxRows) {
  
  const  emptyTable = (maxRows, maxCells) =>
    new Array(maxRows).fill(new Array(maxCells).fill(0))
  
  const { subscribe, set, update } = writable(emptyTable(maxRows, maxCells))
  
	return {
    subscribe,
		setBall: (rowIndex, cellIndex, value) => {
      update(table => {
        const row = [...table[rowIndex]]
        row[cellIndex] = value  
        table[rowIndex] = row

        return table
      })
    },
    moveBall: (from, to) => {
      update(table => {
        let row = [...table[from.rowIndex]]
        let color = row[from.cellIndex]
        row[from.cellIndex] = 0
        table[from.rowIndex] = row
        
        row = [...table[to.rowIndex]]
        row[to.cellIndex] = color
        table[to.rowIndex] = row
        return table
      })
    },
    eraseLine: line => {
      update(table => {
        line.forEach(item => {
          const row = [...table[item.rowIndex]]
          row[item.cellIndex] = 0
          table[item.rowIndex] = row  
        })
        
        return table
      })
    },
		reset: () => set(emptyTable(maxRows, maxCells)),
	}
}

export const table = createTable(maxCells, maxRows)