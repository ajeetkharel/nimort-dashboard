import SplitPane from "react-split-pane";
import { Button, Layout } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { addPane, removePane } from "./rtk/panes/slices";
import { addWidget } from "./rtk/dashboard/slices";
import "./App.css";

import {
  CloseCircleFilled,
  ExpandAltOutlined,
} from "@ant-design/icons/lib/icons";
import Splitter from "./components/Splitter";

const Content = Layout;
const Pane = SplitPane;

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4))).toString(
      16
    )
  );
}

function App() {
  const dispatch = useDispatch();
  const split_panes = useSelector((state) => state.panes.panes);

  return (
    <>
      <Content className="top-bar">
        <h1 className="text-item">Reports</h1>
        <Button type="primary" onClick={() => dispatch(addWidget())}>
          Add Figure
        </Button>
      </Content>
      <div style={{ backgroundColor: "blue" }}>
        <SplitPane split="vertical" style={{ backgroundColor: "blue" }}>
          {split_panes.map((filename) => (
              <Pane className="pane-content" minSize="20%" key={filename}>
                <div>
                  <div className="title-bar">
                    <div className="file-name">{filename.payload}</div>
                    <div className="actions">
                      <Button
                        icon={<ExpandAltOutlined />}
                        type="text"
                        size="small"
                        primary
                      ></Button>
                      <Button
                        icon={<CloseCircleFilled />}
                        type="text"
                        size="small"
                        onClick={() => dispatch(removePane(filename))}
                        danger
                      ></Button>
                    </div>
                  </div>
                  <div className="site-layout-content"></div>
                </div>
              </Pane>
          ))}
        </SplitPane>
      </div>
    </>
  );
}

export default App;
