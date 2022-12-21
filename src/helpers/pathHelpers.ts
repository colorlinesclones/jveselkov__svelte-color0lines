import { Graph, astar } from './astar'

function getPath(
  table: TTable,
  fieldFrom: TField,
  fieldTo: TField,
): TPath {
  const graph = new Graph(
    table.map((row) => row.map((cell) => (!!cell ? 0 : 1))),
  )

  const result: TPath = astar
    .search(
      graph,
      graph.grid[fieldFrom.rowIndex][fieldFrom.cellIndex],
      graph.grid[fieldTo.rowIndex][fieldTo.cellIndex],
    )
    .map((item) => {
      return {
        rowIndex: Number(item.x),
        cellIndex: Number(item.y),
      }
    })

  return result.length > 0 ? [fieldFrom, ...result] : []
}

export { getPath }
