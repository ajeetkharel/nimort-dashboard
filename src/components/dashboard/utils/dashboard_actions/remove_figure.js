import { generateWidget } from "../tools/widget_generator";


export function removeFigureFromDashboard(tree, key) {
    let treeStructure;
    var pane = generateWidget(0, 0, "vertical", key.payload);
    if (pane.key == tree.key) {
        treeStructure= {};
    } else {
        var parentPane = replacePanesMakeEmpty(
            { ...tree },
            pane
        );
        if (parentPane.panes.length === 0) {
            treeStructure= {};
        } else {
            treeStructure= parentPane;
        }
    }
    return treeStructure;
}

export function replacePanesMakeEmpty(parentPane, newPane, except = -1) {
    parentPane.panes.forEach((pane, idx) => {
        var tempPanes;
        var comingPane;
        if (pane.key == newPane.key) {
            if (parentPane.key != except) {
                tempPanes = [...parentPane.panes];
                tempPanes.splice(idx, 1);
                parentPane.panes = tempPanes;
            }
        } else if (pane.panes.length > 0) {
            comingPane = replacePanesMakeEmpty({ ...pane }, newPane, except);
            tempPanes = [...parentPane.panes];
            let index = parentPane.panes.indexOf(pane);
            if (comingPane.panes.length != 0) {
                tempPanes[index] = comingPane;
            } else {
                tempPanes.splice(index, 1);
            }
            parentPane.panes = tempPanes;
        }
    });
    return parentPane;
}