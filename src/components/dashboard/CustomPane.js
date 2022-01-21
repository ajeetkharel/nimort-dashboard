import { draggedInto } from "../../rtk/dashboard/slices";
import { useDispatch } from "react-redux";
import AntTable from "../AntTable";
import { useDrag } from "react-dnd";
import { useDrop } from "react-dnd";
import { CloseButton, DragButton, MaximizeButton } from "./CustomButtons";
import { useRef } from "react";

const CustomPane = (props) => {
    let config = props.config;
    const dispatch = useDispatch();
    const ref = useRef(null);
    
    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: "SplitPane",
        item: { config },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (dropResult !== null) {
                dispatch(draggedInto([item.config.key, dropResult.key]));
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    }));

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: "SplitPane",
        // hover(item, monitor) {
        //   console.log(item);
        // },
        drop: () => ({ key: config.key }),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));
    preview(drop(ref));

    const isActive = canDrop && isOver;
    let backgroundColor = "#fff";
    if (isActive) {
        backgroundColor = "darkgreen";
    } else if (canDrop) {
        backgroundColor = "darkkhaki";
    }
    const opacity = isDragging ? 0.9 : 1;
    return (
        <div
            style={{
                width: `100%`,
                height: `100%`,
            }}
            key={config.key}
            ref={ref}
            role={"SplitPane"}
            style={{ opacity, backgroundColor }}
            data-testid={`box-${config.key}`}
        >
            <div className="title-bar">
                <div className="file-name">{config.key}</div>
                {config.key !== "Reports" ? (
                    <div className="actions">
                        <DragButton pane_key={config.key} drag={drag} />
                        <MaximizeButton pane_key={config.key} />
                        <CloseButton pane_key={config.key} />
                    </div>
                ) : (
                    ""
                )}
            </div>
            <AntTable />
        </div>
    );
};

export default CustomPane;
