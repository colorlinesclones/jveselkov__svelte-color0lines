import { writable, derived } from 'svelte/store'
import type { Writable } from 'svelte/store'
import { MAX_CELLS, MAX_ROWS } from '@/settings'
import { setTableCell, getEmptyTable } from '@/helpers'

type TTableStore = {
  subscribe: Writable<TTable>['subscribe']
  setBall: (ield: TField, value: number) => void
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
    setBall: (field, value) => {
      update((table) => setTableCell(table, field, value))
    },
    moveBall: (from, to) => {
      update((table) => {
        const value = table[from.rowIndex][from.cellIndex]

        return setTableCell(setTableCell(table, to, value), from, 0)
      })
    },
    eraseLine: (line) => {
      update((table) => {
        line.forEach((item) => {
          table = setTableCell(table, item, 0)
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
