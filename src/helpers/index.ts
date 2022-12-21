import { COUNT_BALL_TO_ERASE } from '@/settings'

function getRandomInt(min: number, max: number) {
  let rand = min - 0.5 + Math.random() * (max - min + 1)
  return Math.round(rand)
}

function getRandomEmptyField(table) {
  let rowIndex, cellIndex

  do {
    rowIndex = getRandomInt(0, table.length - 1)
    cellIndex = getRandomInt(0, table[0].length - 1)
  } while (table[rowIndex][cellIndex] !== 0)

  return {
    rowIndex,
    cellIndex,
  }
}

function checkLines(table, rowIndex, cellIndex) {
  if (table[rowIndex][cellIndex] == undefined) {
    return []
  }
  const MAX_CELLS = table[0].length
  const MAX_ROWS = table.length

  const lines = []

  const horizontalLine = []

  for (let index = cellIndex; index >= 0; index--) {
    if (table[rowIndex][index] === table[rowIndex][cellIndex]) {
      horizontalLine.push({
        rowIndex,
        cellIndex: index,
      })
    } else {
      break
    }
  }

  for (let index = cellIndex + 1; index < MAX_CELLS; index++) {
    if (table[rowIndex][index] === table[rowIndex][cellIndex]) {
      horizontalLine.push({
        rowIndex,
        cellIndex: index,
      })
    } else {
      break
    }
  }

  const verticalLine = []

  for (let index = rowIndex; index >= 0; index--) {
    if (table[index][cellIndex] === table[rowIndex][cellIndex]) {
      verticalLine.push({
        rowIndex: index,
        cellIndex,
      })
    } else {
      break
    }
  }

  for (let index = rowIndex + 1; index < MAX_ROWS; index++) {
    if (table[index][cellIndex] === table[rowIndex][cellIndex]) {
      verticalLine.push({
        rowIndex: index,
        cellIndex,
      })
    } else {
      break
    }
  }

  if (horizontalLine.length >= COUNT_BALL_TO_ERASE) {
    lines.push(horizontalLine)
  }

  if (verticalLine.length >= COUNT_BALL_TO_ERASE) {
    lines.push(verticalLine)
  }

  return lines.flat()
}

import { Graph, astar } from './astar'

function getPath(
  table,
  rowIndexFrom,
  cellIndexFrom,
  rowIndexTo,
  cellIndexTo,
) {
  const graph = new Graph(
    table.map((row) => row.map((cell) => (!!cell ? 0 : 1))),
  )

  const result = astar
    .search(
      graph,
      graph.grid[rowIndexFrom][cellIndexFrom],
      graph.grid[rowIndexTo][cellIndexTo],
    )
    .map((item) => {
      return {
        rowIndex: item.x,
        cellIndex: item.y,
      }
    })

  return result.length > 0
    ? [
        {
          rowIndex: rowIndexFrom,
          cellIndex: cellIndexFrom,
        },
        ...result,
      ]
    : []
}

export { checkLines, getPath, getRandomEmptyField, getRandomInt }

export * from './debounce'
