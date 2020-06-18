import { writable } from 'svelte/store'

function createScore() {   

  const { subscribe, set, update } = writable(0)
  
	return {
    subscribe,
    add: value => update(score => score + value),
    reset: () => set(0),
	}
}

export const score = createScore()