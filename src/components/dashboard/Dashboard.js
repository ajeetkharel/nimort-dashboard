import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Splitter from "./Splitter";

export const Dashboard = (props) => {
  let tree = props.tree;
  return (
    <DndProvider backend={HTML5Backend}>
      {tree["key"] !== undefined
        ? [tree].map((splitter) => <Splitter config={splitter} />)
        : "Empty dash"}
    </DndProvider>
  )
}

export default Dashboard;
