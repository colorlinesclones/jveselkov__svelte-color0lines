import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

import { COUNT_BALL_TO_ERASE } from '@/settings'

type TScoreStore = {
  subscribe: Writable<number>['subscribe']
  add: (value: number) => void
  reset: () => void
}

function createScore(): TScoreStore {
  const { subscribe, set, update } = writable(0)

  return {
    subscribe,
    add: (value) =>
      update(
        (score) =>
          score +
          (COUNT_BALL_TO_ERASE + (value - COUNT_BALL_TO_ERASE) * 2),
      ),
    reset: () => set(0),
  }
}

export const score = createScore()
