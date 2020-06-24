export function GridNode(x, y, weight) {
  this.x = x
  this.y = y
  this.weight = weight
}

GridNode.prototype.toString = function () {
  return `[${this.x} ${this.y}]`
}

GridNode.prototype.getCost = function (fromNeighbor) {
  if (
    fromNeighbor &&
    fromNeighbor.x !== this.x &&
    fromNeighbor.y !== this.y
  ) {
    return this.weight * 1.41421
  }

  return this.weight
}

GridNode.prototype.isWall = function () {
  return this.weight === 0
}
