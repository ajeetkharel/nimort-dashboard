import AntTable from "../AntTable";
import { CloseButton, DragButton, MaximizeButton } from "./CustomButtons";
import React, { useRef } from "react";
import { draggedInto } from "../../rtk/dashboard/slices";
import { useDrag } from "react-dnd";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";

const CustomPane = React.memo((props) => {
    let config = props.config;
    const dispatch = useDispatch();

    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: "SplitPane",
        item: { config },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if ((dropResult !== null) && (dropResult.key !== item.config.key)) {
                dispatch(draggedInto({ "from": item.config.key, "to": dropResult.key, "direction": "bottom" }));
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
        hover: (item, monitor) => {
            console.log(item);
            console.log(config);
        },
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

    const ref = useRef(null);
    drop(preview(ref));

    return (
        <div
            key={config.key}
            ref={ref}
            id={config.key}
            role={"SplitPane"}
            style={{ opacity, backgroundColor, height: "100%", width: "100%" }}
            data-testid={`box-${config.key}`}
        >
            <div>
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
            </div>
        </div>
    );
});

export default CustomPane;
