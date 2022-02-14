import React, { useState, useEffect } from "react";
import SplitPane from "react-split-pane";
import CustomPane from "./CustomPane";
import Pane from "react-split-pane/lib/Pane";

import 'react-reflex/styles.css';


const Splitter = React.memo((props) => {
  let config = props.config;
  let sizes = [];
  if (config.panes.length > 0) {
    config.panes.map((pane, idx) => {
      if (window.localStorage.getItem("SizeOf" + pane["key"]) === null) {
        window.localStorage.setItem("SizeOf" + pane["key"], pane["size"]);
      }

      let currentSize = window.localStorage.getItem("SizeOf" + pane["key"]);

      if(sizes[idx] != currentSize ) {
        sizes.push(currentSize);
      }
    });
  }

  const [paneSizes, setPaneSizes] = useState(sizes);

  useEffect(() => {
    console.log("Length changed");
    if (config.panes.length > 0) {
      if (window.localStorage.getItem("SizeOf" + config.panes[0]["key"]) == 100) {
        let newSizes = [];
        if (config.panes.length > 0) {
          config.panes.map((pane) => {
            newSizes.push(pane["size"]);
          })
        }
        setPaneSizes(newSizes);
      }
    }
  }, [config.panes.length])


  return (
    <SplitPane
      split={config.split}
      onChange={(sizes) => {
        let changedSizes = []
        sizes.map((size) => changedSizes.push(parseFloat(size)));
        setPaneSizes(changedSizes);
        window.localStorage.setItem("SizeOf" + config["key"], changedSizes);
      }}
    >
      {
        (config.panes.length > 0) ?
          config.panes.map((s, idx) => {
            return (
              console.log("Assigning sizes to pane", s["key"], paneSizes),
              <Pane size={`${paneSizes[idx] || 50}%`} minSize="20%">
                <Splitter config={s} />
              </Pane>
            )
          })
          : [<CustomPane config={config} />]
      }
    </SplitPane>
  );
});

export default Splitter;
