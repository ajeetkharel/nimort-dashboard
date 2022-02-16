import AntTable from "./AntTable";
import { CloseButton, DragButton, MaximizeButton } from "./CustomButtons";
import React, { useEffect, useRef, useState } from "react";
import { draggedInto } from "../../rtk/dashboard/slices";
import { useDrag } from "react-dnd";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";

const CustomPane = React.memo((props) => {
    const config = props.config;
    const dispatch = useDispatch();

    const [isInTBLR, setIsInTBLR] = useState([false, false, false, false]);
    let dropDirection = "top";
 
    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: "SplitPane",
        item: { config },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if ((dropResult !== null) && (dropResult.key !== item.config.key)) {
                dispatch(draggedInto({ "from": item.config.key, "to": dropResult.key, "direction": dropResult.direction }));
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    }));


    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: "SplitPane",
        drop: () => {
            setIsInTBLR([false, false, false, false]);
            return { key: config.key, direction: dropDirection }
        },
        canDrop: (item, monitor) => {
            if (config.key !== item.config.key) {
                return true;
            }
            return false;
        },
        hover: (item, monitor) => {
            if (config.key !== item.config.key) {
                console.log(item);
                console.log("Dragging", monitor.getClientOffset());
                console.log("Dropping", ref.current.getBoundingClientRect());

                const dragPosition = monitor.getClientOffset();
                const dropTargetBounds = ref.current.getBoundingClientRect();

                const relativePosition = [dragPosition['x'] - dropTargetBounds['x'], dragPosition['y'] - dropTargetBounds['y']];
                console.log("Relative", relativePosition);

                const layoutDists = {
                    "top": relativePosition[1],
                    "left": relativePosition[0],
                    "right": dropTargetBounds["width"] - relativePosition[0],
                    "bottom": dropTargetBounds["height"] - relativePosition[1]
                }
                var keys = Object.keys(layoutDists);
                var lowest = Math.min.apply(null, keys.map(function (x) { return layoutDists[x] }));
                var match = keys.filter(function (y) { return layoutDists[y] === lowest })[0];

                switch (match) {
                    case ("top"):
                        setIsInTBLR([true, false, false, false]);
                        break;
                    case ("bottom"):
                        setIsInTBLR([false, true, false, false]);
                        break;
                    case ("left"):
                        setIsInTBLR([false, false, true, false]);
                        break;
                    case ("right"):
                        setIsInTBLR([false, false, false, true]);
                        break;
                }
                dropDirection = match;
                console.log("New drop direction", dropDirection);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));

    if(!isOver & isInTBLR.some((element) => element)){
        setIsInTBLR([false, false, false, false])
    }

    let backgroundColor = "#fff";
    const opacity = isDragging ? 0.9 : 1;

    const ref = useRef(null);
    drop(preview(ref));

    return (
        <div
            key={config.key}
            ref={ref}
            id={config.key}
            role={"SplitPane"}
            style={{ opacity, backgroundColor, height: "100%", width: "100%", position: "relative" }}
        >
            <div style={{
                gridTemplateColumns: "auto",
                position: "absolute",
                top: 0,
                display: isOver & isInTBLR[0] || isInTBLR[1] ? "grid" : "none",
                zIndex: "2",
                height: "100%",
                width: "100%",
                opacity: "0.5"
            }}>
                <div style={{
                    border: "1px solid rgba(0, 0, 0, 0.8)",
                    opacity: isInTBLR[0] ? "1" : "0",
                    backgroundColor: "#2196F3",
                }} class="grid-item">1</div>
                <div style={{
                    border: "1px solid rgba(0, 0, 0, 0.8)",
                    opacity: isInTBLR[1] ? "1" : "0",
                    backgroundColor: "#2196F3",
                }} class="grid-item">2</div>
            </div>

            <div style={{
                gridTemplateColumns: "auto",
                gridAutoFlow: "column",
                position: "absolute",
                top: 0,
                zIndex: "2",
                display: isOver & isInTBLR[2] || isInTBLR[3] ? "grid" : "none",
                height: "100%",
                width: "100%",
                opacity: "0.5"
            }}>
                <div style={{
                    border: "1px solid rgba(0, 0, 0, 0.8)",
                    opacity: isInTBLR[2] ? "1" : "0",
                    backgroundColor: "#2196F3",
                }} class="grid-item">1</div>
                <div style={{
                    border: "1px solid rgba(0, 0, 0, 0.8)",
                    opacity: isInTBLR[3] ? "1" : "0",
                    backgroundColor: "#2196F3",
                }} class="grid-item">2</div>
            </div>


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
            <div><AntTable /></div>
        </div >
    );
});

export default CustomPane;
