import { Button, Input, Layout } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { addNewTab, addWidget, exportDashboard, importDashboard } from "./rtk/reportDashboard/slices";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import { useRef } from "react";
import { uuidv4 } from "./components/dashboard/utils/tools/widgetGenerator";
import { Tabs } from 'antd';
import Reports from "./components/Reports";
import Profiles from "./components/Profiles";
import { DashboardType } from "./constants/dashboard_constants";

const { TabPane } = Tabs;
const Content = Layout;

function App() {
  const dispatch = useDispatch();
  const inputFile = useRef(null);
  const titleRef = useRef(null);

  const activeKey = useSelector((state) => state.reportDashboards.activeKey);


  function handleFileImportChange(event) {
    let reader = new FileReader();
    reader.onload = ((event) => {
      let obj = JSON.parse(event.target.result);
      dispatch(importDashboard(obj));
    });
    reader.readAsText(event.target.files[0]);
  }


  return (
    <div style={{ height: "100%", boxSizing: "border-box" }}>
      <Content className="top-bar">
        <h1 className="text-item">Reports</h1>
        <div style={{ marginTop: "10px", display: "flex", "justifyContent": "space-between" }}>
          <div style={{ marginRight: "10px" }}>
            <Button type="primary" onClick={() => dispatch(exportDashboard())}>
              Save dashboard
            </Button>
          </div>
          <div>
            <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} accept=".json" onChange={handleFileImportChange} />
            <Button type="primary" onClick={() => inputFile.current.click()}>
              Open dashboard
            </Button>
          </div>
        </div>
        <hr style={{ width: "20%" }}></hr>
        <div style={{ display: "flex" }}>
          <div>
            <Input ref={titleRef} />
          </div>
          <div>
            <Button type="primary"
              onClick={
                () => {
                  dispatch(addWidget([{ title: titleRef.current.state.value }, activeKey]));
                }
              }
            >
              Add Report
            </Button>
          </div>
        </div>
      </Content>

      <Tabs
        style={{
          height: "100%",
          boxSizing: "border-box"
        }}
        size="large"
        defaultActiveKey="2">
        <TabPane tab="Reports" key="1">
          <Reports />
        </TabPane>
        <TabPane tab="Profiles" key="2">
          <Profiles />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default App;
