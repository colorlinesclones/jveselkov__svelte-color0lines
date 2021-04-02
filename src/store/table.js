import { writable, derived } from 'svelte/store'
import { maxCells, maxRows } from './../settings'

function setTableCell(table, { rowIndex, cellIndex, value }) {
  const row = [...table[rowIndex]]
  row[cellIndex] = value
  table[rowIndex] = row

  return table
}

function createTable(maxCells, maxRows) {
  const emptyTable = (maxRows, maxCells) =>
    new Array(maxRows).fill(new Array(maxCells).fill(0))

  const { subscribe, set, update } = writable(
    emptyTable(maxRows, maxCells),
  )

  return {
    subscribe,
    setBall: (rowIndex, cellIndex, value) => {
      update((table) =>
        setTableCell(table, {
          rowIndex,
          cellIndex,
          value,
        }),
      )
    },
    moveBall: (from, to) => {
      update((table) => {
        const value = table[from.rowIndex][from.cellIndex]

        return setTableCell(
          setTableCell(table, {
            ...to,
            value,
          }),
          {
            ...from,
            value: 0,
          },
        )
      })
    },
    eraseLine: (line) => {
      update((table) => {
        line.forEach((item) => {
          table = setTableCell(table, {
            ...item,
            value: 0,
          })
        })

        return table
      })
    },
    reset: () => set(emptyTable(maxRows, maxCells)),
  }
}

export const table = createTable(maxCells, maxRows)

export const emptyBallsCount = derived(
  table,
  ($table) => $table.flat().filter((item) => item === 0).length,
)
