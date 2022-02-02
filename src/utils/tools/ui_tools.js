import { generateWidget } from "./widget_generator";

export function getArea(pane) {
    var height = pane["height"];
    var width = pane["width"];
    return height * width;
}

export function splitVertically(pane) {
    var height = pane["height"];
    var width = pane["width"];
    var newWidth = ~~(width / 2);

    var childPane = generateWidget(height, newWidth);
    return {
        ...pane,
        split: "vertical",
        panes: [{ ...pane.panes[0], width: newWidth }, childPane],
    };
}

export function splitHorizontally(pane) {
    var width = pane["width"];
    var height = pane["height"];
    var newHeight = ~~(height / 2);

    var childPane = generateWidget(newHeight, width);
    return {
        ...pane,
        split: "horizontal",
        panes: [{ ...pane.panes[0], height: newHeight }, childPane],
    };
}
