import { generateWidget } from "./widgetGenerator";

export function getArea(pane) {
    let element = document.getElementById(pane["key"]) || document.getElementById(pane.panes[0]["key"])
    let height = element.clientHeight;
    let width = element.clientWidth;
    return height * width;
}

export function splitVertically(pane, report) {
    let size = window.localStorage.getItem("SizeOf"+pane["key"]) ||  window.localStorage.getItem("SizeOf"+pane.panes[0]["key"]) || pane["size"];

    let childPane = generateWidget(report["title"], 50);
    return {
        ...pane,
        size: Math.round(size),
        split: "vertical",
        panes: [{ ...pane.panes[0], size: 50}, childPane],
    };
}

export function splitHorizontally(pane, report) {
    let size = window.localStorage.getItem("SizeOf"+pane["key"]) ||  window.localStorage.getItem("SizeOf"+pane.panes[0]["key"]) || pane["size"];

    let childPane = generateWidget(report["title"], 50);
    return {
        ...pane,
        size: Math.round(size),
        split: "horizontal",
        panes: [{ ...pane.panes[0], size: 50}, childPane],
    };
}
