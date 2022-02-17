import { generateWidget } from "../tools/widgetGenerator";


export function removeFigureFromDashboard(tree, key) {
    let treeStructure;
    let pane = generateWidget(0, "vertical", key.payload);
    if (pane.key == tree.key) {
        treeStructure = {};
    } else {
        let parentPane = replacePanesMakeEmpty(
            { ...tree },
            pane
        );
        if (parentPane.panes.length === 0) {
            treeStructure = {};
        } else {
            treeStructure = parentPane;
        }
    }
    return treeStructure;
}

export function replacePanesMakeEmpty(parentPane, newPane, except = -1) {
    parentPane.panes.forEach((pane, idx) => {
        let tempPanes;
        let tempPane;
        let comingPane;
        let tempSize;
        if (pane.key == newPane.key) {
            if (parentPane.key != except) {
                tempPanes = [...parentPane.panes];
                tempSize = Math.round(window.localStorage.getItem("SizeOf"+tempPanes[idx]["key"]));
                tempPanes.splice(idx, 1);
                if (tempPanes.length > 0) {
                    tempPane = {...tempPanes[0]};
                    tempPane["size"] = Math.round(window.localStorage.getItem("SizeOf"+tempPane["key"])) + tempSize;
                    window.localStorage.setItem("SizeOf"+tempPane["key"], tempPane["size"])
                    parentPane.panes = [tempPane]
                }
                else {
                    parentPane.panes = [];
                }
            }
        } else if (pane.panes.length > 0) {
            comingPane = replacePanesMakeEmpty({ ...pane }, newPane, except);
            tempPanes = [...parentPane.panes];
            let index = parentPane.panes.indexOf(pane);
            if (comingPane.panes.length != 0) {
                tempPanes[index] = comingPane;
                parentPane.panes = tempPanes;
            } else {
                tempSize = Math.round(window.localStorage.getItem("SizeOf"+tempPanes[index]["key"]));
                tempPanes.splice(index, 1);
                if (tempPanes.length > 0) {
                    tempPane = {...tempPanes[0]};
                    tempPane["size"] = Math.round(window.localStorage.getItem("SizeOf"+tempPane["key"])) + tempSize;
                    window.localStorage.setItem("SizeOf"+tempPane["key"], tempPane["size"])
                    parentPane.panes = [tempPane]
                }
                else {
                    parentPane.panes = [];
                }
            }
        }
    });
    return parentPane;
}