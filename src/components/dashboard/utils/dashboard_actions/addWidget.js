import { getPaneWithHighestArea } from "../tools/helpers";
import { splitHorizontally, splitVertically } from "../tools/uiTools";
import { generateSplitter } from "../tools/widgetGenerator";


export function addWidgetInDashboard(tree, data) {
    let treeStructure;
    if (isEmptyDashboard(tree)) {
        treeStructure = generateSplitter(data["title"], 100);
    }
    else {
        let [pane, splitterObj, toSplit, index] = addNewPane(
            tree,
            data
        );
        if (toSplit) {
            let tempPanes = [...pane["panes"]];
            tempPanes.splice(index, 1, splitterObj);
            pane = { ...pane, panes: tempPanes };
        }
        if (tree["key"] === pane["key"]) {
            treeStructure = pane;
        } else {
            let parentPane = replacePaneInTree({ ...tree }, pane);
            treeStructure = parentPane;
        }
    }
    return treeStructure;
}

export function isEmptyDashboard(tree) {
    return (tree["key"] == undefined);
}

function addNewPane(tree, data) {
    let [pane, toSplit, parent] = getPaneWithHighestArea(tree);
    console.log("Highest is ", pane);
    let element = document.getElementById(pane["key"]) || document.getElementById(pane.panes[0]["key"])
    let height = element.clientHeight;
    let width = element.clientWidth;
    if (toSplit) {
        let splitterObj = generateSplitter(
            "",
            100,
            window.localStorage.getItem("SizeOf"+pane["key"]) ||  window.localStorage.getItem("SizeOf"+pane.panes[0]["key"]) || pane["size"],
            pane["split"],
            [pane]
        );
        if (height > width) {
            splitterObj = splitHorizontally(splitterObj, data);
        } else {
            splitterObj = splitVertically(splitterObj, data);
        }
        let index = parent["panes"].indexOf(pane);
        return [parent, splitterObj, toSplit, index];
    } else if (height > width) {
        return [splitHorizontally(pane, data), , toSplit];
    } else {
        return [splitVertically(pane, data), , toSplit];
    }
}

export function replacePaneInTree(parentPane, newPane) {
    parentPane.panes.forEach((pane, idx) => {
        let tempPanes;
        if (pane.key === newPane.key) {
            tempPanes = [...parentPane.panes];
            tempPanes[idx] = newPane;
            parentPane.panes = tempPanes;
        } else if (pane.panes.length > 0) {
            pane = replacePaneInTree({ ...pane }, newPane);
            tempPanes = [...parentPane.panes];
            tempPanes[idx] = pane;
            parentPane.panes = tempPanes;
        }
    });
    return parentPane;
}
