import React, { useState, useEffect, useMemo } from "react";
import SplitPane from "react-split-pane";
import CustomPane from "./CustomPane";
import Pane from "react-split-pane/lib/Pane";

import 'react-reflex/styles.css';
import { bulkUpdateSizeInLocalStorage } from "./utils/tools/helpers";


const CustomSplitPane = React.memo((props) => {
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

  useEffect(() => {
    if (config.panes.length > 0) {
      let newSizes = [];
      if (config.panes.length > 0) {
        config.panes.map((pane) => {
          newSizes.push(pane["size"]);
        })
      }
      setPaneSizes(newSizes);
      bulkUpdateSizeInLocalStorage(newSizes, config.panes);
    }
  }, [config.panes.length])


  return (
    <SplitPane
      split={config.split}
      onResizeEnd={(sizes) => {
        let changedSizes = []
        sizes.map((size) => changedSizes.push(parseFloat(size)));
        setPaneSizes(changedSizes);
        bulkUpdateSizeInLocalStorage(changedSizes, config.panes);
        window.localStorage.setItem("SizeOf" + config["key"], changedSizes);
      }}
      minSize={`${(config.panes.length > 0) ? config.panes.length * 200 : 200}px`}
    >
      {
        (config.panes.length > 0) ?
          config.panes.map((s, idx) => {
            return (
              <Pane split={s.split} size={`${paneSizes[idx] || 50}%`} minSize={`${(s.panes.length > 0) ? s.panes.length * 200 : 200}px`}>
                <CustomSplitPane config={s} />
              </Pane>
            )
          })
          : [<CustomPane config={config} />]
      }
    </SplitPane>
  );
});

export default CustomSplitPane;
