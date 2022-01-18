import React, { useState } from "react";
import SplitPane from "react-split-pane";
import { removePane } from "../rtk/dashboard/slices";
import { Button } from "antd";
import {
  CloseCircleFilled,
  DragOutlined,
  ExpandAltOutlined,
} from "@ant-design/icons/lib/icons";
import { useDispatch } from "react-redux";
import AntList from "../components/AntList";
import { useDrag } from "react-dnd";
import { useDrop } from "react-dnd";

function CloseButton(props) {
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

const PaneWidget = React.memo((props) => {
  const dispatch = useDispatch();
  var config = props.config;
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "SplitPane",
    item: { config },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult !== null) {
        dispatch(draggedInto(item.config.key, dropResult.key))
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "SplitPane",
    drop: () => ({ key: config.key }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  const isActive = canDrop && isOver;
  let backgroundColor = "#fff";
  if (isActive) {
    backgroundColor = "darkgreen";
  } else if (canDrop) {
    backgroundColor = "darkkhaki";
  }
  const opacity = isDragging ? 0.9 : 1;
  return (
    <div id={config.key} ref={drop}>
      <div
        style={{
          width: `100%`,
          height: `100%`,
        }}
        key={config.key}
        ref={preview}
        role={"SplitPane"}
        style={{ opacity, backgroundColor }}
        data-testid={`box-${config.key}`}
      >
        <div className="title-bar">
          <div className="file-name">{config.key}</div>
          {config.key !== "Reports" ? (
            <div className="actions">
              <Button
                icon={<DragOutlined />}
                type="text"
                size="small"
                primary="true"
                ref={drag}
              ></Button>
              <Button
                icon={<ExpandAltOutlined />}
                type="text"
                size="small"
                primary="true"
              ></Button>
              <CloseButton config={config} />
            </div>
          ) : (
            ""
          )}
        </div>
        <AntList />
      </div>
    </div>
  );
});

const Splitter = React.memo((props) => {
  var config = props.config;
  return (
    <SplitPane split={config.split} >
      {config.panes.length > 0 ? (
        config.panes.map((s) => <Splitter config={s} />)
      ) : (
        <PaneWidget config={config} />
      )}
    </SplitPane>
  );
});

export default Splitter;
