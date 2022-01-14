import React, { useState } from "react";
import SplitPane from "react-split-pane";
import { removePane } from "../rtk/dashboard/slices";
import { Button } from "antd";
import {
  CloseCircleFilled,
  ExpandAltOutlined,
} from "@ant-design/icons/lib/icons";
import { useDispatch } from "react-redux";
import AntList from "../components/AntList";

function CustomButton(props) {
  const dispatch = useDispatch();
  return (
    <Button
      icon={<CloseCircleFilled />}
      type="text"
      size="small"
      onClick={() => dispatch(removePane(props.config.key))}
      danger="true"
    ></Button>
  );
}

const Splitter = React.memo((props) => {
  var config = props.config;

  const color = Math.floor  (Math.random() * 16777215).toString(16);
  return (
    <SplitPane split={config.split} key={config.key}>
      {config.panes.length > 0
        ? config.panes.map((s) => <Splitter config={s} />)
        : [
            <div
              id={config.key}
              style={{
                width: `100%`,
                height: `100%`,
              }}
              key={config.key}
            >
              <div className="title-bar">
                <div className="file-name">{config.key}</div>
                {config.key !== "Reports" ? (
                  <div className="actions">
                    <Button
                      icon={<ExpandAltOutlined />}
                      type="text"
                      size="small"
                      primary="true"
                    ></Button>
                    <CustomButton config={config} />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <AntList />
            </div>,
          ]}
    </SplitPane>
  );
});

export default Splitter;
