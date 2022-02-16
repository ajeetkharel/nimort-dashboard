import { generateWidget } from "./widget_generator";

export function getArea(pane) {
    let element = document.getElementById(pane["key"]) || document.getElementById(pane.panes[0]["key"])
    var height = element.clientHeight;
    var width = element.clientWidth;
    return height * width;
}

export function splitVertically(pane) {
    var size = window.localStorage.getItem("SizeOf"+pane["key"]) ||  window.localStorage.getItem("SizeOf"+pane.panes[0]["key"]) || pane["size"];

    var childPane = generateWidget(50);
    return {
        ...pane,
        size: Math.round(size),
        split: "vertical",
        panes: [{ ...pane.panes[0], size: 50}, childPane],
    };
}

export function splitHorizontally(pane) {
    var size = window.localStorage.getItem("SizeOf"+pane["key"]) ||  window.localStorage.getItem("SizeOf"+pane.panes[0]["key"]) || pane["size"];

    var childPane = generateWidget(50);
    return {
        ...pane,
        size: Math.round(size),
        split: "horizontal",
        panes: [{ ...pane.panes[0], size: 50}, childPane],
    };
}
