import { writable } from 'svelte/store'

function createSelected(c) {
  const initial = {
    rowIndex: null,
    cellIndex: null,
  }
  const { subscribe, set, update } = writable(initial)

  return {
    subscribe,
    set: (value) => update(() => value),
    reset: () => set(initial),
  }
}

export const selected = createSelected()
