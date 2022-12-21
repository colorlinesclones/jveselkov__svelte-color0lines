import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

import { getRandomColors } from '@/helpers'
import {
  COUNT_COLORS,
  NEW_BALLS_COUNT,
  INITIAL_BALLS_COUNT,
} from '@/settings'

type TNextBallsStore = {
  subscribe: Writable<number[]>['subscribe']
  random: () => void
  reset: () => void
}

function createNextBalls(
  countColors: number,
  newBallsCount: number,
  initialBallsCount: number,
): TNextBallsStore {
  const { subscribe, set } = writable(
    getRandomColors(countColors, initialBallsCount),
  )

  return {
    subscribe,
    random: () => set(getRandomColors(countColors, newBallsCount)),
    reset: () => set(getRandomColors(countColors, initialBallsCount)),
  }
}

export const next = createNextBalls(
  COUNT_COLORS,
  NEW_BALLS_COUNT,
  INITIAL_BALLS_COUNT,
)
