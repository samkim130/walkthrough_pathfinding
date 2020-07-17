import React, { Component } from "react";
import Node from "./Node/Node";

import "./PathFindingVisualizer.css";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "../Algorithms/dijkstra.js";

//initial start and finish nodes
const ROW_LEN = 20;
const COL_LEN = 50;
const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;
//animation settings
const STAGES = 3;

export default class PathFindingVisualizer extends Component {
  //basic constructor
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      animationInAction: false,
      animationComplete: false,
      startReselect: false,
      finishReselect: false,
      start_end_info: [
        START_NODE_ROW,
        START_NODE_COL,
        FINISH_NODE_ROW,
        FINISH_NODE_COL,
      ],
    };
  }

  //one of the lifecycles
  //runs before mounting
  componentDidMount() {
    const grid = initializeGrid();

    console.log("Component Mounted: Grid set");
    this.setState({ grid });

    console.log("End of DidMount");
  }

  handleMouseDown(row, col) {
    if (this.state.animationInAction) return;
    if (this.state.grid[row][col].isStart) {
      console.log("selected start node");
      this.setState({ startReselect: true, mouseIsPressed: true });
    } else if (this.state.grid[row][col].isFinish) {
      console.log("selected finish node");
      this.setState({ finishReselect: true, mouseIsPressed: true });
    } else {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed || this.state.animationInAction) return; //this only works if the mouse is pressed down, so return if mouseIsPressed = false
    if (this.state.startReselect || this.state.finishReselect) {
      const { start_end_info } = this.state;
      const newGrid = getNewGridWithNewStartFinishNodes(
        this.state.grid,
        row,
        col,
        start_end_info,
        this.state.startReselect,
        this.state.finishReselect
      );

      if (newGrid === this.state.grid) return;

      const row_update = this.state.startReselect
        ? 0
        : this.state.finishReselect
        ? 2
        : -1;
      const col_update = this.state.startReselect
        ? 1
        : this.state.finishReselect
        ? 3
        : -1;

      start_end_info[row_update] = row;
      start_end_info[col_update] = col;
      this.setState({ grid: newGrid, start_end_info: start_end_info });

      if (this.state.animationComplete) {
        const updateGrid = this.updateAnimation();
        this.setState({ grid: updateGrid });
      }
    } else {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
  }

  updateAnimation() {
    const grid = getCleanGrid(this.state.grid, false);
    const startNode =
      grid[this.state.start_end_info[0]][this.state.start_end_info[1]];
    const finishNode =
      grid[this.state.start_end_info[2]][this.state.start_end_info[3]];

    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    const max_distance = finishNode.distance;

    //reset algo
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      const distance = visitedNodesInOrder[i].distance;
      const stage = Math.floor((distance / max_distance) * STAGES);
      const nodeRef_current = visitedNodesInOrder[i].nodeRef.current;
      nodeRef_current.classList.add(`node-visited-noanimation`);
      nodeRef_current.classList.add(`s${stage}`);
    }
    //reset shortestpath
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      const distance = nodesInShortestPathOrder[i].distance;
      const stage = Math.floor((distance / max_distance) * STAGES);
      const nodeRef_current = nodesInShortestPathOrder[i].nodeRef.current;
      nodeRef_current.classList.remove(`node-visited-noanimation`);
      nodeRef_current.classList.remove(`s${stage}`);
      nodeRef_current.classList.add("node-shortest-path-noanimation");
    }

    return grid;
  }

  handleMouseUp() {
    if (this.state.animationInAction) return;
    if (this.state.startReselect || this.state.finishReselect)
      console.log("finished updating start/finish node");
    this.setState({
      mouseIsPressed: false,
      startReselect: false,
      finishReselect: false,
    }); //simply no longer press the mouse
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    const { grid, start_end_info } = this.state;
    const max_distance = grid[start_end_info[2]][start_end_info[3]].distance;
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 15 * (max_distance + 5));
        return;
      }
      const distance = visitedNodesInOrder[i].distance;
      const stage = Math.floor((distance / max_distance) * STAGES);
      setTimeout(() => {
        const nodeRef_current = visitedNodesInOrder[i].nodeRef.current;
        nodeRef_current.classList.add(`node-visited`);
        nodeRef_current.classList.add(`s${stage}`);
        //document.getElementById(`node-${node.row}-${node.col}`).className =("node node-visited");
      }, 15 * distance);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    const { grid, start_end_info } = this.state;
    const max_distance = grid[start_end_info[2]][start_end_info[3]].distance;
    for (let i = 0; i <= nodesInShortestPathOrder.length; i++) {
      if (i === nodesInShortestPathOrder.length) {
        this.setState({ animationInAction: false, animationComplete: true });
        return;
      }
      setTimeout(() => {
        const stage = Math.floor(
          (nodesInShortestPathOrder[i].distance / max_distance) * STAGES
        );
        const nodeRef_current = nodesInShortestPathOrder[i].nodeRef.current;
        nodeRef_current.classList.remove(`node-visited`);
        nodeRef_current.classList.remove(`s${stage}`);
        nodeRef_current.classList.add("node-shortest-path");
        //document.getElementById(`node-${node.row}-${node.col}`).className = "node node-shortest-path";
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    if (this.state.animationInAction) return;
    const { grid } = this.state;

    this.setState({ grid: getCleanGrid(grid, false) });

    this.setState({ animationInAction: true });
    const startNode =
      grid[this.state.start_end_info[0]][this.state.start_end_info[1]];
    const finishNode =
      grid[this.state.start_end_info[2]][this.state.start_end_info[3]];

    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    //this.setState({ animationInAction: false });
  }

  resetGrid() {
    const { grid, animationInAction } = this.state;
    if (animationInAction) return;
    this.setState({ grid: getCleanGrid(grid, true), animationComplete: false });
  }

  //render returns the data
  render() {
    const { grid, mouseIsPressed } = this.state; //destructing assignment to an object //same as "const nodes = this.state.nodes;"
    // const {nodes: displayNodes} = this.state; //const displayNodes= this.state.nodes;
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment

    console.log("render");

    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's algorithm
        </button>
        <button onClick={() => this.resetGrid()}>Reset Grid</button>
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
                  const {
                    row,
                    col,
                    distance,
                    isFinish,
                    isStart,
                    isWall,
                    isVisited,
                    nodeRef,
                  } = node;
                  return (
                    // this command is defining components with parameters
                    //https://reactjs.org/docs/components-and-props.html
                    <Node
                      key={nodeIdx}
                      col={col}
                      row={row}
                      distance={distance}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      isVisited={isVisited}
                      mouseIsPressed={mouseIsPressed}
                      nodeRef={nodeRef}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
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

  for (let row = 0; row < ROW_LEN; row++) {
    const currentRow = [];
    for (let col = 0; col < COL_LEN; col++)
      currentRow.push(createNode(col, row));
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
    nodeRef: React.createRef(),
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  //console.log("wall toggled");
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithNewStartFinishNodes = (
  grid,
  row,
  col,
  startinfo,
  isStart,
  isFinish
) => {
  /*if startReselect is active and the node is a finish node or if finishReselect is active and the node is a start node*/
  if (isStart & grid[row][col].isFinish || isFinish & grid[row][col].isStart)
    return grid;
  const newGrid = grid.slice();
  /*update the new node*/
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isStart: isStart,
    isFinish: isFinish,
  };
  newGrid[row][col] = newNode;
  /*update old node */
  const old_row = isStart ? startinfo[0] : isFinish ? startinfo[2] : -1;
  const old_col = isStart ? startinfo[1] : isFinish ? startinfo[3] : -1;

  const oldNode = newGrid[old_row][old_col];
  const newOldNode = {
    ...oldNode,
    isStart: false,
    isFinish: false,
  };
  newGrid[old_row][old_col] = newOldNode;
  return newGrid;
};

const getCleanGrid = (grid, resetWall) => {
  for (const currentRow of grid) {
    for (const currentNode of currentRow) {
      currentNode.distance = Infinity;
      currentNode.isVisited = false;
      if (resetWall) currentNode.isWall = false;
      currentNode.previousNode = null;
      currentNode.nodeRef.current.className = "";
      currentNode.nodeRef.current.classList.add("node");
      if (currentNode.isWall) {
        currentNode.nodeRef.current.classList.add("node-wall");
      } else if (currentNode.isStart) {
        currentNode.nodeRef.current.classList.add("node-start");
      } else if (currentNode.isFinish) {
        currentNode.nodeRef.current.classList.add("node-finish");
      }
    }
  }
  return grid;
};
