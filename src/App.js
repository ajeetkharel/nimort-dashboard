import { Button, Layout, Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { addFigure } from "./rtk/dashboard/slices";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";

const Content = Layout;
const { TabPane } = Tabs;

function App() {
  const dispatch = useDispatch();
  const tree = useSelector((state) => state.dashboard.tree);

  function tabChanged(key) {
    console.log(key);
  }

  return (
    <div style={{ backgroundColor: "#ededed" }}>
      <Content className="top-bar" key={1}>
        <h1 className="text-item">Reports</h1>
        <Button type="primary" onClick={() => dispatch(addFigure())}>
          Add Figure
        </Button>
      </Content>

      <div style={{ height: "800px", margin: "5px" }} key={2}>
        <Dashboard tree={tree} />
      </div>
    </div>
  );
}

export default App;
