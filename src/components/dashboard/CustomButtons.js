import { Button } from "antd";
import {
  CloseCircleFilled,
  DragOutlined,
  ExpandAltOutlined,
} from "@ant-design/icons/lib/icons";
import { useDispatch } from "react-redux";
import { removePane } from "../../rtk/dashboard/slices";

export const CloseButton = (props) => {
  const dispatch = useDispatch();
  return (
    <Button
      icon={<CloseCircleFilled />}
      type="text"
      size="small"
      onClick={() => dispatch(removePane(props.pane_key))}
      danger="true"
    ></Button>
  );
};

export const DragButton = (props) => {
  return (
    <Button
      icon={<DragOutlined />}
      type="text"
      size="small"
      primary="true"
      key={`DragButtonFor${props.pane_key}`}
      ref={props.drag}
    ></Button>
  );
};

export const MaximizeButton = (props) => {
  return (
    <Button
      icon={<ExpandAltOutlined />}
      type="text"
      size="small"
      key={`MaximizeButtonFor${props.pane_key}`}
      primary="true"
    ></Button>
  );
};
