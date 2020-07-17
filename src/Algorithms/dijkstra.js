// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;

  //save the contents of the grid into 'unvisitedNodes'
  //constant variables cannot be reassigned, but its properties can change
  const unvisitedNodes = getAllNodes(grid);

  var distance_final = -1;
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
    if ((distance_final > 0) & (distance_final < closestNode.distance))
      return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    //if the last added node is finishNode, end the loop and return the answer;
    if (closestNode === finishNode) {
      distance_final = closestNode.distance;
      //return visitedNodesInOrder;
    }
    if (!((distance_final > 0) & (distance_final <= closestNode.distance)))
      updateUnvisitedNeighbors(closestNode, grid);
  }
}

//sorts the double array by node distance
function sortNodesByDistance(unvisitedNodes) {
  //sort by distance property of the nodes in the array
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

//
function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  //update the unvisited neighbors
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

//fetch neighbors to the 'closestNode' that have not been visited yet
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  //save the positional values of the 'closestNode'
  const { col, row } = node;

  if (row > 0) neighbors.push(grid[row - 1][col]); //includes the left neighbor of the node, unless it's already at leftmost
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]); //includes right neighbor of the node, unless it's already at rightmost
  if (col > 0) neighbors.push(grid[row][col - 1]); //includes the north neighbor of the node, unless it's at the northmost
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]); //includes the south neighbor of the node, unless it's at the southmost

  return neighbors.filter((neighbor) => !neighbor.isVisited); //filter out nodes that are already visited
}

//convert a double array into a single array
//https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node); //this pushes the reference
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  //keep adding the nodes into 'nodesInShortestPathOrder'
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
