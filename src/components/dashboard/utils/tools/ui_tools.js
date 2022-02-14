import { generateWidget } from "./widget_generator";

export function getArea(pane) {
    let element = document.getElementById(pane["key"]) || document.getElementById(pane.panes[0]["key"])
    var height = element.clientHeight;
    var width = element.clientWidth;
    return height * width;
}

export function splitVertically(pane) {
    let element = document.getElementById(pane["key"]) || document.getElementById(pane.panes[0]["key"])
    var height = element.clientHeight;
    var width = element.clientWidth;
    var newWidth = ~~(width / 2);

    var childPane = generateWidget(50);
    return {
        ...pane,
        split: "vertical",
        panes: [{ ...pane.panes[0], size: 50}, childPane],
    };
}

export function splitHorizontally(pane) {
    let element = document.getElementById(pane["key"]) || document.getElementById(pane.panes[0]["key"])
    var height = element.clientHeight;
    var width = element.clientWidth;
    var newHeight = ~~(height / 2);

    var childPane = generateWidget(50);
    return {
        ...pane,
        split: "horizontal",
        panes: [{ ...pane.panes[0], size: 50}, childPane],
    };
}
