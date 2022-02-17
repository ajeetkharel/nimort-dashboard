import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CustomSplitPane from "./CustomSplitPane";

export const Dashboard = React.memo((props) => {
  let tree = props.tree;
  return (
    <DndProvider backend={HTML5Backend}>
      {tree["key"] !== undefined
        ? [tree].map((splitter_config) => {
          return <CustomSplitPane config={splitter_config} />
        })
        : "Empty dash"}
    </DndProvider>
  );
});

export default Dashboard;
