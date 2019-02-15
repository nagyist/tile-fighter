import {IGridNode} from './gridnode'
import BinaryHeap from './heap'
import {IGraph} from './graph'

function pathTo(node: IGridNode) {
  let curr = node
  const path: IGridNode[] = []
  while (curr.parent) {
    path.unshift(curr)
    curr = curr.parent
  }
  return path
}

function getHeap() {
  return new BinaryHeap((node: IGridNode) => node.f)
}

export default {
  search(graph: IGraph, start: IGridNode, end: IGridNode) {
    graph.cleanDirty()
    const heuristic = this.heuristics
    const openHeap = getHeap()

    start.h = heuristic(start, end)
    this.graph.markDirty(start)

    openHeap.push(start)

    while (openHeap.size() > 0) {
      const currentNode = openHeap.pop()
      if (currentNode === end) {
        return pathTo(currentNode)
      }

      currentNode.closed = true
      const neighbors = this.graph.neighbors(currentNode)

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
          this.graph.markDirty(neighbor)

          if (!beenVisited) {
            openHeap.push(neighbor)
          } else {
            openHeap.rescoreElement(neighbor)
          }
        }
      }
    }
    return []
  },

  heuristics(pos1: any, pos2: any) {
    const d1 = Math.abs(pos2.x - pos1.x)
    const d2 = Math.abs(pos2.y - pos1.y)
    return d1 + d2
  },

  cleanNode(node: IGridNode) {
    node.f = 0
    node.g = 0
    node.h = 0
    node.visited = false
    node.closed = false
    node.parent = null
  }
}
