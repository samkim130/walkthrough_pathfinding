import React, { Component } from "react";
import "./Node.css";

export const DEFAULT_NODE = {
  row: 0,
  col: 0,
};

export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      isFinish,
      isStart,
      isVisited,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      col,
      row,
    } = this.props;
    const extraClassName = isFinish
      ? "node-finish"
      : isStart
      ? "node-start"
      : isWall
      ? "node-wall"
      : isVisited
      ? "node-visited"
      : "";
    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      ></div>
    );
    // tempelate literals using ``// u can basically write equestions inside tempelate literals
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
  }
}
