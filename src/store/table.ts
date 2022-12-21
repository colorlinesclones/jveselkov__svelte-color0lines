import { writable, derived } from 'svelte/store'
import { MAX_CELLS, MAX_ROWS } from '@/settings'

function setTableCell(table, { rowIndex, cellIndex, value }) {
  const row = [...table[rowIndex]]
  row[cellIndex] = value
  table[rowIndex] = row

  return table
}

function createTable(MAX_CELLS, MAX_ROWS) {
  const emptyTable = (MAX_ROWS, MAX_CELLS) =>
    new Array(MAX_ROWS).fill(new Array(MAX_CELLS).fill(0))

  const { subscribe, set, update } = writable(
    emptyTable(MAX_ROWS, MAX_CELLS),
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
    reset: () => set(emptyTable(MAX_ROWS, MAX_CELLS)),
  }
}

export const table = createTable(MAX_CELLS, MAX_ROWS)

export const emptyBallsCount = derived(
  table,
  ($table) => $table.flat().filter((item) => item === 0).length,
)
