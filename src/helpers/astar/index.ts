import { getHeap } from './BinaryHeap'
import { Graph } from './Graph'
import type { GridNode } from './GridNode'

function pathTo(node: GridNode) {
  let curr = node
  const path = []

  while (curr.parent) {
    path.unshift(curr)
    curr = curr.parent
  }

  return path
}

const astar = {
  search(
    graph: Graph,
    start: GridNode,
    end: GridNode,
    options?: any,
  ) {
    graph.cleanDirty()
    options = options || {}

    const heuristic = options.heuristic || astar.heuristics.manhattan
    const closest = options.closest || false

    const openHeap = getHeap()
    let closestNode = start

    start.h = heuristic(start, end)
    graph.markDirty(start)

    openHeap.push(start)

    while (openHeap.size() > 0) {
      const currentNode = openHeap.pop()

      if (currentNode === end) {
        return pathTo(currentNode)
      }

      currentNode.closed = true

      const neighbors = graph.neighbors(currentNode)

      for (let i = 0, il = neighbors.length; i < il; ++i) {
        const neighbor = neighbors[i]

        if (neighbor.closed || neighbor.isWall()) {
          continue
        }

        const gScore = currentNode.g + neighbor.getCost(currentNode)
        const beenVisited = neighbor.visited

        if (!beenVisited || gScore < neighbor.g) {
          neighbor.visited = true
          neighbor.parent = currentNode
          neighbor.h = neighbor.h || heuristic(neighbor, end)
          neighbor.g = gScore
          neighbor.f = neighbor.g + neighbor.h
          graph.markDirty(neighbor)

          if (closest) {
            if (
              neighbor.h < closestNode.h ||
              (neighbor.h === closestNode.h &&
                neighbor.g < closestNode.g)
            ) {
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
    manhattan(pos0: GridNode, pos1: GridNode) {
      const d1 = Math.abs(pos1.x - pos0.x)
      const d2 = Math.abs(pos1.y - pos0.y)

      return d1 + d2
    },

    diagonal(pos0: GridNode, pos1: GridNode) {
      const D = 1
      const D2 = Math.sqrt(2)
      const d1 = Math.abs(pos1.x - pos0.x)
      const d2 = Math.abs(pos1.y - pos0.y)

      return D * (d1 + d2) + (D2 - 2 * D) * Math.min(d1, d2)
    },
  },
}

export { astar, Graph }
