import { generateWidget } from "./widget_generator";

export function getArea(pane) {
    let element = document.getElementById(pane["key"]) || document.getElementById(pane.panes[0]["key"])
    var height = element.clientHeight;
    var width = element.clientWidth;
    console.log("Area", pane["key"], height, width);
    return height * width;
}

export function splitVertically(pane) {
    let element = document.getElementById(pane["key"]) || document.getElementById(pane.panes[0]["key"])
    var height = element.clientHeight;
    var width = element.clientWidth;
    var newWidth = ~~(width / 2);

    var childPane = generateWidget(height, newWidth);
    return {
        ...pane,
        split: "vertical",
        panes: [{ ...pane.panes[0], width: newWidth }, childPane],
    };
}

export function splitHorizontally(pane) {
    let element = document.getElementById(pane["key"]) || document.getElementById(pane.panes[0]["key"])
    var height = element.clientHeight;
    var width = element.clientWidth;
    var newHeight = ~~(height / 2);

    var childPane = generateWidget(newHeight, width);
    return {
        ...pane,
        split: "horizontal",
        panes: [{ ...pane.panes[0], height: newHeight }, childPane],
    };
}
