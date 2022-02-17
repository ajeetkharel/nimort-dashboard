import { Button, Layout, Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { addFigure, exportDashboard, importDashboard } from "./rtk/dashboard/slices";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import { useRef } from "react";

const Content = Layout;

function App() {
  const dispatch = useDispatch();
  const tree = useSelector((state) => state.dashboard.tree);
  const inputFile = useRef(null);

  function handleFileImportChange(event) {
    let reader = new FileReader();
    reader.onload = ((event) => {
      let obj = JSON.parse(event.target.result);
      dispatch(importDashboard(obj));
    });
    reader.readAsText(event.target.files[0]);
  }

  return (
    <div style={{ backgroundColor: "#ededed" }}>
      <Content className="top-bar" key={1}>
        <h1 className="text-item">Reports</h1>
        <div style={{ marginTop: "10px", display: "flex", "justifyContent": "space-between" }}>
          <div style={{ marginRight: "10px" }}>
            <Button type="primary" onClick={() => dispatch(exportDashboard())}>
              Export dashboard
            </Button>
          </div>
          <div>
            <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} accept=".json" onChange={handleFileImportChange} />
            <Button type="primary" onClick={() => inputFile.current.click()}>
              Import dashboard
            </Button>
          </div>
        </div>
        <hr style={{ width: "20%" }}></hr>
        <div>
          <Button type="primary" onClick={() => dispatch(addFigure())}>
            Add Figure
          </Button>
        </div>
      </Content>


      <div style={{ height: "800px", margin: "5px" }} key={2}>
        <Dashboard tree={tree} />
      </div>
    </div>
  );
}

export default App;
