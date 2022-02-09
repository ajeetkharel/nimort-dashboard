import React from "react";
import SplitPane from "react-split-pane";
import CustomPane from "./CustomPane";
import Pane from "react-split-pane/lib/Pane";


const Splitter = React.memo((props) => {
  let config = props.config;

  return (
    <SplitPane
      split={config.split}
      size={config.size}
      minSize="20%"
    >
      {
        (config.panes.length > 0) ?
          config.panes.map((s) => <Splitter config={s} />)
          : <CustomPane config={config} />
      }
    </SplitPane>
  );
});

export default Splitter;
