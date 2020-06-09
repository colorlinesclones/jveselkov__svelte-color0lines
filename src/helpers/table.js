const maxCells = 9
const maxRows = 9
const countColors = 5
const initialBallsCount = 5
const newBallsCount = 3
const countBallToErase = 5

function getRandomInt(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function setTableCell(table, rowIndex, cellIndex, value) {
  const row = [...table[rowIndex]]
  row[cellIndex] = value  
  table[rowIndex] = row

  return table
}

function eraseTableCells(table, cells) {
  if (!cells || cells.length === 0) {
    return table
  }

  let newTable = table

  cells.forEach(cell => newTable = setTableCell(newTable, cell.rowIndex, cell.cellIndex))

  return newTable
}

function addRandomBall(table) {
  let rowIndex, cellIndex

  do {
    rowIndex = getRandomInt(0, maxRows -1)
    cellIndex = getRandomInt(0, maxCells -1)
  } while (table[rowIndex][cellIndex] !== undefined)
  
  return setTableCell(table, rowIndex, cellIndex, getRandomInt(1, countColors))
}

function addRandomBalls(table, count) {
  let newTable = table
  for (let index = 0; index < count; index++) {
    newTable = addRandomBall(newTable)
  }
  
  return newTable
}

function createEmptyTable() {  
  return new Array(maxRows).fill(new Array(maxCells).fill(undefined))
}

function createNewTable() {
  return addRandomBalls(createEmptyTable(), initialBallsCount)
}

function addNextBalls(table) {
  return addRandomBalls(table, newBallsCount)
}

function moveBallOnTable(table, rowIndexFrom, cellIndexFrom, rowIndexTo, cellIndexTo) {

  const color = table[rowIndexFrom][cellIndexFrom]
  
  return setTableCell(
    setTableCell(table, rowIndexFrom, cellIndexFrom, undefined),
    rowIndexTo, cellIndexTo, color
  )
}

function checkLines(table, rowIndex, cellIndex) {
  if (table[rowIndex][cellIndex] == undefined) {
    return []
  }

  const lines = []
      
  const horizontalLine = []

  for (let index = cellIndex; index >= 0; index--) {
    if (table[rowIndex][index] === table[rowIndex][cellIndex]) {  
      horizontalLine.push({
        rowIndex,
        cellIndex: index
      })
    } else {
      break
    }
  }

  for (let index = cellIndex + 1; index < maxCells; index++) {
    if (table[rowIndex][index] === table[rowIndex][cellIndex]) {  
      horizontalLine.push({
        rowIndex,
        cellIndex: index
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
        cellIndex
      })
    } else {
      break
    }
  }

  for (let index = rowIndex + 1; index < maxRows; index++) {
    if (table[index][cellIndex] === table[rowIndex][cellIndex]) {  
      verticalLine.push({
        rowIndex: index,
        cellIndex
      })
    } else {
      break
    }
  }

  if (horizontalLine.length >= countBallToErase) {
    lines.push(horizontalLine)  
  }
  
  if (verticalLine.length >= countBallToErase) {
    lines.push(verticalLine)  
  }

  return lines.flat()
}

import { Graph, astar } from './astar'

function checkAvailableCell(table, rowIndexFrom, cellIndexFrom, rowIndexTo, cellIndexTo) {
  const graph = new Graph(table.map(row => row.map(cell => !!cell ? 0 : 1)))

  const result = astar.search(
    graph, 
    graph.grid[rowIndexFrom][cellIndexFrom], 
    graph.grid[rowIndexTo][cellIndexTo]
  )

  return result.length > 0
}

function gameOver(table) {
  const ballsCount = table.flat().filter(item => item !== undefined).length

  return  ballsCount + newBallsCount >= maxCells*maxRows 
}

function getPoints(count) {
  return countBallToErase + (count - countBallToErase) * 2
}

export {
  addNextBalls,
  createNewTable,
  moveBallOnTable,
  checkLines,
  eraseTableCells,
  gameOver,
  checkAvailableCell,
  getPoints
}