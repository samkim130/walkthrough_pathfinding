import React, { Component } from "react";
import Node from "./Node/Node";
//import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import "./PathFindingVisualizer.css";

export default class PathFindingVisualizer extends Component {
  //basic constructor
  constructor() {
    super();
    this.state = {
      nodes: [],
    };
  }

  //one of the lifecycles
  //runs before mounting
  componentDidMount() {
    const nodes = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        const currentNode = {
          col,
          row,
          isStart: row === 10 && col === 5,
          isFinish: row === 10 && col === 45,
        };
        currentRow.push(currentNode);
      }
      nodes.push(currentRow);
    }
    console.log("nodes set");
    this.setState({ nodes });
  }

  //render returns the data
  render() {
    const { nodes } = this.state; //destructing assignment to an object //same as "const nodes = this.state.nodes;"
    // const {nodes: displayNodes} = this.state; //const displayNodes= this.state.nodes;
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment

    console.log(nodes);

    return (
      <div className="grid">
        {nodes.map((row, rowIdx) => {
          //assigns each element in 'nodes' to variable 'row'; same thing as for loop with row=nodes[i]
          //'rowIdx' contains the index number of the element in 'nodes'; basically the 'i' in the for loop
          //in this case, each element 'row' is each 'currentRow' defined in 'componentDidMount()'
          //https://medium.com/@galiciandeveloper/the-function-map-in-javascript-es6-79ea829abc7f#:~:text=This%20useful%20array%20method%20creates,element%20in%20the%20calling%20array.&text=Let%20talk%20about%20we%20have,coordinates%20x%2C%20y%20and%20name.

          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                //assigns each element in 'row' to variable 'node'; same thing as for loop with node=row[i]
                //'nodeIdx' contains the index number of the element in 'row'; basically the 'i' in the for loop
                //in this case, each element 'node' is each 'currentNode' defined in 'componentDidMount()'
                const { isStart, isFinish } = node;
                return (
                  // this command is defining components with parameters
                  //https://reactjs.org/docs/components-and-props.html
                  <Node
                    key={nodeIdx}
                    isStart={isStart}
                    isFinish={isFinish}
                    test={"foo"}
                    test2={"Kappa"}
                  ></Node>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}
