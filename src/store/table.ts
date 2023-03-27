import { writable, derived } from 'svelte/store'
import type { Writable } from 'svelte/store'
import { MAX_CELLS, MAX_ROWS } from '@/settings'
import { getEmptyTable } from '@/helpers'

type TTableStore = {
  subscribe: Writable<TTable>['subscribe']
  setBall: (field: TField, value: number) => void
  moveBall: (from: TField, to: TField) => void
  eraseLine: (line: TPath) => void
  reset: () => void
}

function createTable(maxCells: number, maxRows: number): TTableStore {
  const { subscribe, set, update } = writable<TTable>(
    getEmptyTable(maxCells, maxRows),
  )

  return {
    subscribe,
    setBall: ({ rowIndex, cellIndex }, value) => {
      update((table) => {
        table[rowIndex][cellIndex] = value
        return table
      })
    },
    moveBall: (from, to) => {
      update((table) => {
        const value = table[from.rowIndex][from.cellIndex]
        table[from.rowIndex][from.cellIndex] =
          table[to.rowIndex][to.cellIndex]
        table[to.rowIndex][to.cellIndex] = value

        return table
      })
    },
    eraseLine: (line) => {
      update((table) => {
        line.forEach(({ rowIndex, cellIndex }) => {
          table[rowIndex][cellIndex] = 0
        })

        return table
      })
    },
    reset: () => set(getEmptyTable(maxCells, maxRows)),
  }
}

export const table = createTable(MAX_CELLS, MAX_ROWS)

export const emptyBallsCount = derived(
  table,
  ($table) => $table.flat().filter((item) => item === 0).length,
)
