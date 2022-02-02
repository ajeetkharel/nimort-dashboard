import { getPaneWithHighestArea } from "../tools/helpers";
import { splitHorizontally, splitVertically } from "../tools/ui_tools";
import { generateSplitter } from "../tools/widget_generator";


export function addFigureInDashboard(tree) {
    let treeStructure;
    if (isEmptyDashboard(tree)) {
        treeStructure = generateSplitter(800, 1156);
    }
    else {
        var [pane, splitterObj, toSplit, index] = addNewPane(
            tree
        );
        if (toSplit) {
            var tempPanes = [...pane["panes"]];
            tempPanes.splice(index, 1, splitterObj);
            pane = { ...pane, panes: tempPanes };
        }
        if (tree["key"] === pane["key"]) {
            treeStructure = pane;
        } else {
            var parentPane = replacePaneInTree({ ...tree }, pane);
            treeStructure = parentPane;
        }
    }
    return treeStructure;
}

export function isEmptyDashboard(tree) {
    return (tree["key"] == undefined);
}

function addNewPane(tree) {
    var [pane, toSplit, parent] = getPaneWithHighestArea(tree);
    if (toSplit) {
        var splitterObj = generateSplitter(
            pane["height"],
            pane["width"],
            pane["split"],
            [pane]
        );
        if (splitterObj.height > splitterObj.width) {
            splitterObj = splitHorizontally(splitterObj);
        } else {
            splitterObj = splitVertically(splitterObj);
        }
        var index = parent["panes"].indexOf(pane);
        return [parent, splitterObj, toSplit, index];
    } else if (pane.height > pane.width) {
        return [splitHorizontally(pane), , toSplit];
    } else {
        return [splitVertically(pane), , toSplit];
    }
}

export function replacePaneInTree(parentPane, newPane) {
    parentPane.panes.forEach((pane, idx) => {
        var tempPanes;
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