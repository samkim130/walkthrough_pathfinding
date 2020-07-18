import { getAllNodes, getUnvisitedNeighbors } from "./dijkstra.js";

export function Astar(grid, startNode, finishNode) {
  //const start_xy = [startNode.row, startNode.col];
  const finish_xy = [finishNode.row, finishNode.col];
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  startNode.g_distance = 0;

  const unvisitedNodes = getAllNodes(grid);
  var skip = false;
  //double not (!!) changes objects into boolean
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT
  //while loop keeps running until there are no more elements left
  while (!!unvisitedNodes.length) {
    //sort the array by distance
    if (!skip) {
      sortNodesByDistance(unvisitedNodes);
    } else {
      skip = false;
    }

    //returns the first element in 'unvisitedNodes'
    const closestNode = unvisitedNodes.shift();

    // If we encounter a wall, we skip it.
    if (closestNode.isWall & !(closestNode.isFinish || closestNode.isStart)) {
      skip = true;
      continue;
    }

    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    //if the last added node is finishNode, end the loop and return the answer;
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid, finish_xy);
  }
}
function sortNodesByDistance(unvisitedNodes) {
  //sort by distance property of the nodes in the array
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  unvisitedNodes.sort((nodeA, nodeB) => {
    const comparison = nodeA.distance - nodeB.distance;
    if (comparison === 0) {
      return nodeA.h_distance - nodeB.h_distance;
    }
    return comparison;
  });
}

function updateUnvisitedNeighbors(node, grid, finish_xy) {
  const neighbors = getUnvisitedNeighbors(node, grid);
  //update the unvisited neighbors
  for (const neighbor of neighbors) {
    const g_distance = 1 + node.g_distance;
    // Math.abs(node.row - neighbor.row) +
    //Math.abs(node.col - neighbor.col) +
    if (neighbor.isVisited & (neighbor.g_distance < g_distance)) {
      continue;
    } else if (!neighbor.isVisited) {
      const h_distance =
        Math.abs(finish_xy[0] - neighbor.row) +
        Math.abs(finish_xy[1] - neighbor.col);
      neighbor.h_distance = h_distance;
    }

    neighbor.g_distance = g_distance;
    neighbor.distance = neighbor.g_distance + neighbor.h_distance;
    neighbor.previousNode = node;
  }
}
