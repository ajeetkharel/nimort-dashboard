import React from "react";
import SplitPane from "react-split-pane";

export default function Splitter(props) {
  return <SplitPane split={props.split}></SplitPane>;
}
