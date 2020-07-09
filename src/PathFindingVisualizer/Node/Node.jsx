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
    const { isFinish, isStart } = this.props;
    const extraClassName = isFinish
      ? "node-finish"
      : isStart
      ? "node-start"
      : "";
    return <div className={`node ${extraClassName}`}></div>;
    // tempelate literals using ``// u can basically write equestions inside tempelate literals
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
  }
}
