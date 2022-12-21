import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

type TSelectedStore = {
  subscribe: Writable<null | TField>['subscribe']
  set: (value: TField) => void
  reset: () => void
}

function createSelected(): TSelectedStore {
  const initial: TField | null = null
  const { subscribe, set, update } = writable(initial)

  return {
    subscribe,
    set: (value) => {
      update((currentValue) => {
        if (
          currentValue?.cellIndex === value.cellIndex &&
          currentValue?.rowIndex === value.rowIndex
        ) {
          return null
        }

        return value
      })
    },
    reset: () => set(initial),
  }
}

export const selected = createSelected()
