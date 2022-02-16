import React, { useState, useEffect, useMemo } from "react";
import SplitPane from "react-split-pane";
import CustomPane from "./CustomPane";
import Pane from "react-split-pane/lib/Pane";

import 'react-reflex/styles.css';


const Splitter = React.memo((props) => {
  let config = props.config;

  let sizes = [];
  if (config.panes.length > 0) {
    config.panes.map((pane) => {
      if (window.localStorage.getItem("SizeOf" + pane["key"]) === null) {
        window.localStorage.setItem("SizeOf" + pane["key"], pane["size"]);
      }

      let currentSize = window.localStorage.getItem("SizeOf" + pane["key"]);
      sizes.push(currentSize);

    });
  }
  const [paneSizes, setPaneSizes] = useState(sizes);

  function updateLocalStorage(sizes, panes) {
    if (panes.length > 0) {
      for (let i = 0; i < sizes.length; i++) {
        window.localStorage.setItem("SizeOf" + panes[i]["key"], sizes[i]);
      }
    }
  }


  useEffect(() => {
    if (config.panes.length > 0) {
      let newSizes = [];
      if (config.panes.length > 0) {
        config.panes.map((pane) => {
          newSizes.push(pane["size"]);
        })
      }
      setPaneSizes(newSizes);
      updateLocalStorage(newSizes, config.panes);
    }
  }, [config.panes.length])


  return (
    <SplitPane
      split={config.split}
      onResizeEnd={(sizes) => {
        let changedSizes = []
        sizes.map((size) => changedSizes.push(parseFloat(size)));
        setPaneSizes(changedSizes);
        updateLocalStorage(changedSizes, config.panes);
        window.localStorage.setItem("SizeOf" + config["key"], changedSizes);
      }}
      minSize={`${(config.panes.length > 0) ? config.panes.length * 200 : 200}px`}
    >
      {
        (config.panes.length > 0) ?
          config.panes.map((s, idx) => {
            return (
              <Pane split={s.split} size={`${paneSizes[idx] || 50}%`} minSize={`${(s.panes.length > 0) ? s.panes.length * 200 : 200}px`}>
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
