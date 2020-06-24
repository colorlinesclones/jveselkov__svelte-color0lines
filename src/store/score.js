import { writable } from 'svelte/store'
import { countBallToErase } from './../settings'

function createScore() {
  const { subscribe, set, update } = writable(0)

  return {
    subscribe,
    add: (value) =>
      update(
        (score) =>
          score + (countBallToErase + (value - countBallToErase) * 2),
      ),
    reset: () => set(0),
  }
}

export const score = createScore()
