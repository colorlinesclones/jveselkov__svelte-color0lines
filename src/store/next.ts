import { writable } from 'svelte/store'
import { getRandomInt } from '@/helpers'
import {
  COUNT_COLORS,
  NEW_BALLS_COUNT,
  INITIAL_BALLS_COUNT,
} from '@/settings'

function randomArr(COUNT_COLORS, NEW_BALLS_COUNT) {
  return new Array(NEW_BALLS_COUNT)
    .fill(0)
    .map(() => getRandomInt(1, COUNT_COLORS))
}

function createNextBalls(
  COUNT_COLORS,
  NEW_BALLS_COUNT,
  INITIAL_BALLS_COUNT,
) {
  const { subscribe, set } = writable(
    randomArr(COUNT_COLORS, INITIAL_BALLS_COUNT),
  )

  return {
    subscribe,
    random: () => set(randomArr(COUNT_COLORS, NEW_BALLS_COUNT)),
    reset: () => set(randomArr(COUNT_COLORS, INITIAL_BALLS_COUNT)),
  }
}

export const next = createNextBalls(
  COUNT_COLORS,
  NEW_BALLS_COUNT,
  INITIAL_BALLS_COUNT,
)
