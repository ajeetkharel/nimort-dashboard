import { Button, Layout } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { addWidget } from "./rtk/dashboard/slices";
import "./App.css";
import Splitter from "./tools/RenderSplitter";
import "./App.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Content = Layout;

function App() {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard.structure);
  console.log();
  return (
    <div style={{ backgroundColor: "#ededed" }}>
      <Content className="top-bar" key={1}>
        <h1 className="text-item">Reports</h1>
        <Button type="primary" onClick={() => dispatch(addWidget())}>
          Add Figure
        </Button>
      </Content>

      <div style={{ height: "800px", margin: "5px" }} key={2}>
        <DndProvider backend={HTML5Backend}>
          {dashboard["key"] != undefined
            ? [dashboard].map((splitter) => <Splitter config={splitter} />)
            : "Empty dash"}
        </DndProvider>
      </div>
    </div>
  );
}

export default App;
