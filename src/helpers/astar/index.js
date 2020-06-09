import { getHeap } from './binaryHeap'
import { GridNode} from './gridNode'

function Graph(gridIn, options) {
  options = options || {}
  this.nodes = []
  this.diagonal = !!options.diagonal
  this.grid = []

  for (let x = 0; x < gridIn.length; x++) {
    this.grid[x] = []

    for (let y = 0, row = gridIn[x]; y < row.length; y++) {
      let node = new GridNode(x, y, row[y])
      
      this.grid[x][y] = node
      this.nodes.push(node)
    }
  }

  this.init()
}

Graph.prototype.init = function() {
  this.dirtyNodes = []

  for (let i = 0; i < this.nodes.length; i++) {
    astar.cleanNode(this.nodes[i])
  }
}

Graph.prototype.cleanDirty = function() {
  for (let i = 0; i < this.dirtyNodes.length; i++) {
    astar.cleanNode(this.dirtyNodes[i])
  }

  this.dirtyNodes = []
}

Graph.prototype.markDirty = function(node) {
  this.dirtyNodes.push(node)
}

Graph.prototype.neighbors = function(node) {
  const ret = []
  const x = node.x
  const y = node.y
  const grid = this.grid

  // West
  if (grid[x - 1] && grid[x - 1][y]) {
    ret.push(grid[x - 1][y])
  }

  // East
  if (grid[x + 1] && grid[x + 1][y]) {
    ret.push(grid[x + 1][y])
  }

  // South
  if (grid[x] && grid[x][y - 1]) {
    ret.push(grid[x][y - 1])
  }

  // North
  if (grid[x] && grid[x][y + 1]) {
    ret.push(grid[x][y + 1])
  }

  if (!this.diagonal) {
    return ret
  }
  
  // Southwest
  if (grid[x - 1] && grid[x - 1][y - 1]) {
      ret.push(grid[x - 1][y - 1])
  }

  // Southeast
  if (grid[x + 1] && grid[x + 1][y - 1]) {
      ret.push(grid[x + 1][y - 1])
  }

  // Northwest
  if (grid[x - 1] && grid[x - 1][y + 1]) {
      ret.push(grid[x - 1][y + 1])
  }

  // Northeast
  if (grid[x + 1] && grid[x + 1][y + 1]) {
      ret.push(grid[x + 1][y + 1])
  }

  return ret
}

Graph.prototype.toString = function() {
  const graphString = []
  const nodes = this.grid

  for (let x = 0; x < nodes.length; x++) {
    const rowDebug = []
    const row = nodes[x]
    
    for (let y = 0; y < row.length; y++) {
      rowDebug.push(row[y].weight)
    }

    graphString.push(rowDebug.join(" "))
  }

  return graphString.join("\n")
}
function pathTo(node) {
  let curr = node
  const path = []

  while (curr.parent) {
    path.unshift(curr)
    curr = curr.parent
  }
  
  return path
}

const astar = {
  search(graph, start, end, options) {
    graph.cleanDirty()
    options = options || {}
    
    let heuristic = options.heuristic || astar.heuristics.manhattan
    let closest = options.closest || false

    let openHeap = getHeap()
    let closestNode = start

    start.h = heuristic(start, end)
    graph.markDirty(start)

    openHeap.push(start)

    while (openHeap.size() > 0) {
      let currentNode = openHeap.pop()

      if (currentNode === end) {
        return pathTo(currentNode)
      }

      currentNode.closed = true

      let neighbors = graph.neighbors(currentNode)

      for (let i = 0, il = neighbors.length; i < il; ++i) {
        let neighbor = neighbors[i]

        if (neighbor.closed || neighbor.isWall()) {
          continue
        }

        let gScore = currentNode.g + neighbor.getCost(currentNode)
        let beenVisited = neighbor.visited

        if (!beenVisited || gScore < neighbor.g) {
          neighbor.visited = true
          neighbor.parent = currentNode
          neighbor.h = neighbor.h || heuristic(neighbor, end)
          neighbor.g = gScore
          neighbor.f = neighbor.g + neighbor.h
          graph.markDirty(neighbor)

          if (closest) {
            if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
              closestNode = neighbor
            }
          }

          if (!beenVisited) {
            openHeap.push(neighbor)
          } else {
            openHeap.rescoreElement(neighbor)
          }
        }
      }
    }

    if (closest) {
      return pathTo(closestNode)
    }

    return []
  },

  heuristics: {
    manhattan(pos0, pos1) {
      let d1 = Math.abs(pos1.x - pos0.x)
      let d2 = Math.abs(pos1.y - pos0.y)

      return d1 + d2
    },

    diagonal(pos0, pos1) {
      let D = 1
      let D2 = Math.sqrt(2)
      let d1 = Math.abs(pos1.x - pos0.x)
      let d2 = Math.abs(pos1.y - pos0.y)

      return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2))
    }
  },

  cleanNode(node) {
    node.f = 0
    node.g = 0
    node.h = 0
    node.visited = false
    node.closed = false
    node.parent = null
  }
}

export  {
  astar,
  Graph
}