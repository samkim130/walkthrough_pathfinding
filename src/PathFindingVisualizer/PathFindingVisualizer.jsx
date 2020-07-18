import React, { Component } from "react";
import Node from "./Node/Node";

import "./PathFindingVisualizer.css";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "../Algorithms/dijkstra.js";
import { Astar } from "../Algorithms/Astar.js";

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
      isStar: false,
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
        const updateGrid = this.updateAnimation(newGrid);
        this.setState({ grid: updateGrid });
      }
    } else {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
  }

  updateAnimation(newGrid) {
    const grid = getCleanGrid(newGrid, false, false);
    const startNode =
      grid[this.state.start_end_info[0]][this.state.start_end_info[1]];
    const finishNode =
      grid[this.state.start_end_info[2]][this.state.start_end_info[3]];

    if (this.state.isAstar) {
      Astar(grid, startNode, finishNode);
    } else {
      dijkstra(grid, startNode, finishNode);
    }
    getNodesInShortestPathOrder(finishNode);
    return grid;
  }

  handleMouseUp() {
    if (this.state.animationInAction) return;
    if (this.state.startReselect || this.state.finishReselect)
      console.log("finished updating start/finish node");
    this.setState({
      grid: this.state.grid,
      mouseIsPressed: false,
      startReselect: false,
      finishReselect: false,
    }); //simply no longer press the mouse
  }

  animateAlgorithm(
    visitedNodesInOrder,
    nodesInShortestPathOrder,
    isAstarPressed
  ) {
    const { grid, start_end_info } = this.state;
    const max_distance = isAstarPressed
      ? grid[start_end_info[2]][start_end_info[3]].g_distance
      : grid[start_end_info[2]][start_end_info[3]].distance;
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder, isAstarPressed);
        }, 15 * (max_distance + 5));
        return;
      }
      const distance = isAstarPressed
        ? visitedNodesInOrder[i].g_distance
        : visitedNodesInOrder[i].distance;
      const stage = Math.floor((distance / max_distance) * STAGES);
      setTimeout(() => {
        const nodeRef_current = visitedNodesInOrder[i].nodeRef.current;
        nodeRef_current.classList.add(`node-visited`);
        nodeRef_current.classList.add(`s${stage}`);
        //document.getElementById(`node-${node.row}-${node.col}`).className =("node node-visited");
      }, 15 * distance);
    }
  }

  animateShortestPath(nodesInShortestPathOrder, isAstarPressed) {
    const { grid, start_end_info } = this.state;
    const max_distance = isAstarPressed
      ? grid[start_end_info[2]][start_end_info[3]].g_distance
      : grid[start_end_info[2]][start_end_info[3]].distance;
    for (let i = 0; i <= nodesInShortestPathOrder.length; i++) {
      if (i === nodesInShortestPathOrder.length) {
        setTimeout(() => {
          this.setState({ animationInAction: false, animationComplete: true });
        }, 50 * i);
        return;
      }
      setTimeout(() => {
        const distance = isAstarPressed
          ? nodesInShortestPathOrder[i].g_distance
          : nodesInShortestPathOrder[i].distance;
        const stage = Math.floor((distance / max_distance) * STAGES);
        const nodeRef_current = nodesInShortestPathOrder[i].nodeRef.current;
        nodeRef_current.classList.remove(`node-visited`);
        nodeRef_current.classList.remove(`s${stage}`);
        nodeRef_current.classList.add("node-shortest-path");
        //document.getElementById(`node-${node.row}-${node.col}`).className = "node node-shortest-path";
      }, 50 * i);
    }
  }

  visualizeAlgo(isAstarPressed) {
    if (this.state.animationInAction) return;
    this.setState({ animationInAction: true, isAstar: isAstarPressed });
    const { grid } = this.state;

    if (this.state.animationComplete) getCleanGrid(grid, false, true);

    const startNode =
      grid[this.state.start_end_info[0]][this.state.start_end_info[1]];
    const finishNode =
      grid[this.state.start_end_info[2]][this.state.start_end_info[3]];

    //console.log("A Star algo pressed?", this.state.isAstar);
    //console.log("Is animation in action?", this.state.animationInAction);

    const visitedNodesInOrder = isAstarPressed
      ? Astar(grid, startNode, finishNode)
      : dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(
      visitedNodesInOrder,
      nodesInShortestPathOrder,
      isAstarPressed
    );
  }

  resetGrid() {
    const { grid, animationInAction } = this.state;
    console.log("don't reset if true", animationInAction);
    if (animationInAction) return;
    this.setState({
      grid: getCleanGrid(grid, true, false),
      animationComplete: false,
    });
  }

  //render returns the data
  render() {
    const { grid, start_end_info } = this.state; //destructing assignment to an object //same as "const nodes = this.state.nodes;"
    // const {nodes: displayNodes} = this.state; //const displayNodes= this.state.nodes;
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment

    if (grid.length > 0) {
      const finishNode = grid[start_end_info[2]][start_end_info[3]];
      var max_distance = this.state.isAstar
        ? finishNode.g_distance
        : finishNode.distance;
    }
    console.log("render", grid);

    return (
      <>
        <button onClick={() => this.visualizeAlgo(false)}>
          Visualize Dijkstra's algorithm
        </button>
        <button onClick={() => this.visualizeAlgo(true)}>
          Visualize A* algorithm
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
                    h_distance,
                    g_distance,
                    isFinish,
                    isStart,
                    isWall,
                    isVisited,
                    isShortestPath,
                    nodeRef,
                  } = node;
                  const stage = Math.floor(
                    ((this.state.isAstar ? g_distance : distance) /
                      max_distance) *
                      STAGES
                  );
                  return (
                    // this command is defining components with parameters
                    //https://reactjs.org/docs/components-and-props.html
                    <Node
                      key={nodeIdx}
                      coord={{ row, col }}
                      distance={{
                        f_distance: distance,
                        g_distance,
                        h_distance,
                        stage,
                      }}
                      nodeInfo_bool={{
                        isStart,
                        isFinish,
                        isWall,
                        isVisited,
                        isShortestPath,
                      }}
                      isAnimationComplete={
                        this.state.animationComplete &
                        !this.state.animationInAction
                      }
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
    g_distance: Infinity,
    h_distance: Infinity,
    isVisited: false,
    isShortestPath: false,
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

const getCleanGrid = (grid, resetWall, animationReset) => {
  for (const currentRow of grid) {
    for (const currentNode of currentRow) {
      currentNode.distance = Infinity;
      currentNode.g_distance = Infinity;
      currentNode.h_distance = Infinity;
      currentNode.isShortestPath = false;
      currentNode.isVisited = false;
      if (resetWall) currentNode.isWall = false;
      currentNode.previousNode = null;
    }
  }
  return grid;
};
