import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Splitter from "./Splitter";

export const Dashboard = React.memo((props) => {
  let tree = props.tree;
  let dashboard = (
    <DndProvider backend={HTML5Backend}>
      {tree["key"] !== undefined
        ? [tree].map((splitter) => <Splitter config={splitter} />)
        : "Empty dash"}
    </DndProvider>
  );
  return dashboard
});

export default Dashboard;
