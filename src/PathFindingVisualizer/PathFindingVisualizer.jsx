import React, { Component } from "react";
import Node from "./Node/Node";
//import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import "./PathFindingVisualizer.css";
import { dijkstra } from "../Algorithms/dijkstra.js";

//initial start and finish nodes
const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathFindingVisualizer extends Component {
  //basic constructor
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  //one of the lifecycles
  //runs before mounting
  componentDidMount() {
    const grid = initializeGrid();

    console.log("Component Mounted: Grid set");
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  //render returns the data
  render() {
    const { grid } = this.state; //destructing assignment to an object //same as "const nodes = this.state.nodes;"
    // const {nodes: displayNodes} = this.state; //const displayNodes= this.state.nodes;
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment

    console.log("render", grid);

    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's algorithm
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            //assigns each element in 'grid' to variable 'row'; same thing as for loop with row=nodes[i]
            //'rowIdx' contains the index number of the element in 'nodes'; basically the 'i' in the for loop
            //in this case, each element 'row' is each 'currentRow' defined in 'initializeGrid()'
            //https://medium.com/@galiciandeveloper/the-function-map-in-javascript-es6-79ea829abc7f#:~:text=This%20useful%20array%20method%20creates,element%20in%20the%20calling%20array.&text=Let%20talk%20about%20we%20have,coordinates%20x%2C%20y%20and%20name.

            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  //assigns each element in 'row' to variable 'node'; same thing as for loop with node=row[i]
                  //'nodeIdx' contains the index number of the element in 'row'; basically the 'i' in the for loop
                  //in this case, each element 'node' is each 'createNode' created in 'initializeGrid()'
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    // this command is defining components with parameters
                    //https://reactjs.org/docs/components-and-props.html
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

//about function expressions
//https://developer.mozilla.org/en-US/docs/web/JavaScript/Reference/Operators/function#:~:text=The%20main%20difference%20between%20a,soon%20as%20it%20is%20defined.

//called in componentDidMount
const initializeGrid = () => {
  const grid = [];

  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) currentRow.push(createNode(col, row));
    grid.push(currentRow);
  }

  return grid;
};

//called by initializeGrid
const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
