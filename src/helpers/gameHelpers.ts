import { COUNT_BALL_TO_ERASE } from '@/settings'

export function getRandomInt(min: number, max: number) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1))
}

export function getRandomEmptyField(table: TTable): TField {
  const field: TField = {
    rowIndex: 0,
    cellIndex: 0,
  }

  do {
    field.rowIndex = getRandomInt(0, table.length - 1)
    field.cellIndex = getRandomInt(0, table[0].length - 1)
  } while (table[field.rowIndex][field.cellIndex] !== 0)

  return field
}

export function checkLines(
  table: TTable,
  { rowIndex, cellIndex }: TField,
): TPath {
  if (table[rowIndex][cellIndex] == undefined) {
    return []
  }

  const MAX_CELLS = table[0].length
  const MAX_ROWS = table.length

  const horizontalLine: TPath = []

  for (let index = cellIndex; index >= 0; index--) {
    if (table[rowIndex][index] === table[rowIndex][cellIndex]) {
      horizontalLine.push({
        rowIndex,
        cellIndex: index,
      })

      continue
    }

    break
  }

  for (let index = cellIndex + 1; index < MAX_CELLS; index++) {
    if (table[rowIndex][index] === table[rowIndex][cellIndex]) {
      horizontalLine.push({
        rowIndex,
        cellIndex: index,
      })

      continue
    }

    break
  }

  const verticalLine = []

  for (let index = rowIndex; index >= 0; index--) {
    if (table[index][cellIndex] === table[rowIndex][cellIndex]) {
      verticalLine.push({
        rowIndex: index,
        cellIndex,
      })

      continue
    }
    break
  }

  for (let index = rowIndex + 1; index < MAX_ROWS; index++) {
    if (table[index][cellIndex] === table[rowIndex][cellIndex]) {
      verticalLine.push({
        rowIndex: index,
        cellIndex,
      })

      continue
    }
    break
  }

  const lines: TPath[] = []

  if (horizontalLine.length >= COUNT_BALL_TO_ERASE) {
    lines.push(horizontalLine)
  }

  if (verticalLine.length >= COUNT_BALL_TO_ERASE) {
    lines.push(verticalLine)
  }

  return lines.flat()
}

export function getRandomColors(
  countColors: number,
  newBallsCount: number,
) {
  return new Array(newBallsCount)
    .fill(0)
    .map(() => getRandomInt(1, countColors))
}

export function setTableCell(
  table: TTable,
  { rowIndex, cellIndex }: TField,
  value: number,
) {
  const row = [...table[rowIndex]]
  row[cellIndex] = value
  table[rowIndex] = row

  return table
}

export function getEmptyTable(cells: number, rows: number): TTable {
  return new Array(rows).fill(new Array(cells).fill(0))
}
