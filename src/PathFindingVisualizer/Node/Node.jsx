import React, { Component } from "react";
import "./Node.css";

export const DEFAULT_NODE = {
  row: 0,
  col: 0,
};

export default class Node extends Component {
  render() {
    const {
      coord,
      distance,
      nodeInfo_bool,
      isAnimationComplete,
      nodeRef,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
    } = this.props;

    const extraClassName = nodeInfo_bool.isFinish
      ? "node-finish "
      : nodeInfo_bool.isStart
      ? "node-start "
      : nodeInfo_bool.isWall
      ? "node-wall "
      : "";
    const extraClassName_path =
      isAnimationComplete & !nodeInfo_bool.isWall
        ? nodeInfo_bool.isShortestPath
          ? "node-shortest-path-noanimation"
          : nodeInfo_bool.isVisited
          ? `node-visited-noanimation s${distance.stage}`
          : ""
        : "";

    return (
      <div
        id={`node-${coord.row}-${coord.col}`}
        className={`node ${extraClassName}${extraClassName_path}`}
        ref={nodeRef}
        onMouseDown={() => onMouseDown(coord.row, coord.col)}
        onMouseEnter={() => onMouseEnter(coord.row, coord.col)}
        onMouseUp={() => onMouseUp()}
      >
        {nodeInfo_bool.isVisited & false ? `${distance.f_distance}` : null}
      </div>
    );
  }
}
