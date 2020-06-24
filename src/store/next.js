import { writable } from 'svelte/store'
import { getRandomInt } from '../helpers'
import {
  countColors,
  newBallsCount,
  initialBallsCount,
} from './../settings'

const randomArr = (countColors, newBallsCount) =>
  new Array(newBallsCount)
    .fill(0)
    .map(() => getRandomInt(1, countColors))

function createNextBalls(
  countColors,
  newBallsCount,
  initialBallsCount,
) {
  const { subscribe, set } = writable(
    randomArr(countColors, initialBallsCount),
  )

  return {
    subscribe,
    random: () => set(randomArr(countColors, newBallsCount)),
    reset: () => set(randomArr(countColors, initialBallsCount)),
  }
}

export const next = createNextBalls(
  countColors,
  newBallsCount,
  initialBallsCount,
)
