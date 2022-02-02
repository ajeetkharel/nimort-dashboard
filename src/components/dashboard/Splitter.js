import React, { useState } from "react";
import SplitPane from "react-split-pane";
import Pane from "react-split-pane/lib/Pane";
import CustomPane from "./CustomPane";

const Splitter = React.memo((props) => {
  let config = props.config;

  return (config.panes.length > 0) ?
    (
      <SplitPane
        split={config.split}
        size={parseInt(localStorage.getItem(`${config.key}`), 10)}
        defaultSize={parseInt(localStorage.getItem(`${config.key}`), 10)}
        onChange={(size) => localStorage.setItem(`${config.key}`, size)}
      // defaultSize={parseInt(size, 10)}
      // onChange={(size) => {setSize(size); console.log(size);}}
      >
        {
          [config.panes.map((s) => <Splitter config={s} />)]
        }
      </SplitPane>
    ) :
    (
        <CustomPane config={config} />
    )
});

export default Splitter;
