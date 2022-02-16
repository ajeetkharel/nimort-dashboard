import { replacePaneInTree } from "./add_figure";
import { replacePanesMakeEmpty } from "./remove_figure";
import { generateSplitter, generateWidget } from "../tools/widget_generator";

export default function drag_figure(tree, data, direction) {
  let treeStructure;
  let except;
  var panes = data.payload;

  [treeStructure, except] = moveBothFigureToNewSplitter(tree, panes, treeStructure);

  treeStructure = removePreviousChildren(panes[0], tree, treeStructure, except)

  return treeStructure;
}

function moveBothFigureToNewSplitter(tree, panes, treeStructure) {
  console.log(`Dragged from ${panes[0]} to ${panes[1]}`);
  var fromData = findPaneInDashboard([tree], panes[0], {});
  var toData = findPaneInDashboard([tree], panes[1], {});

  // toPane, parent, index
  var toPane = toData[0];
  var fromPane = fromData[0];
  var parent = toData[1];
  var index = toData[2];
  var split = "vertical";
  if (toPane["height"] > toPane["width"]) {
    split = "horizontal";
  }
  var splitterObj = generateSplitter(
    toPane["height"],
    toPane["width"],
    split,
    [toPane, fromPane]
  );

  var tempPanes = [...parent["panes"]];
  tempPanes.splice(index, 1, splitterObj);
  parent = { ...parent, panes: tempPanes };

  if (tree["key"] == parent["key"]) {
    treeStructure = parent;
  } else {
    var parentPane = replacePaneInTree({ ...tree }, parent);
    treeStructure = parentPane;
  }
  return [treeStructure, splitterObj.key];
}

export function findPaneInDashboard(dictlist, value, parent, grandParent) {
  let filteredPanes = dictlist.filter(x => x.key === value)
  if (filteredPanes.length == 1) {
    return [filteredPanes[0], parent, dictlist.indexOf(filteredPanes[0]), grandParent];
  }
  for (let pane of dictlist) {
    if (pane["key"] == value) {
      return [pane, parent, dictlist.indexOf(pane), grandParent];
    }

    if (pane["panes"].length > 0) {
      pane = findPaneInDashboard(pane["panes"], value, pane, parent);
      if (pane) {
        return pane;
      }
    }
  }
}

function removePreviousChildren(key, tree, treeStructure, except) {
  var pane = generateWidget(0, 0, "vertical", key);
  if (pane.key == treeStructure.key) {
    treeStructure = {};
  } else {
    var parentPane = replacePanesMakeEmpty(
      { ...tree },
      pane,
      except
    );
    if (parentPane.panes.length == 0) {
      treeStructure = {};
    } else {
      treeStructure = parentPane;
    }
  }
  return treeStructure;
}

export function replacePanesMakeEmptyForDrag(parentPane, newPane, except = -1) {
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

export function removeLoneParents(parentPane) {
  parentPane.panes.forEach((pane) => {
    var tempPanes;
    let tempPane;
    let comingPane;
    if (pane.panes.length == 1) {
      let savedSize = Math.round(window.localStorage.getItem("SizeOf"+pane["key"]));
      tempPane = {...pane.panes[0], size: savedSize || pane["size"]};
      tempPanes = [...parentPane.panes];
      let index = parentPane.panes.indexOf(pane);
      tempPanes.splice(index, 1, tempPane);
      parentPane.panes = tempPanes;
    } else if (pane.panes.length == 2) {
      comingPane = removeLoneParents({ ...pane });
      tempPanes = [...parentPane.panes];
      let index = parentPane.panes.indexOf(pane);
      tempPanes.splice(index, 1, comingPane);
      parentPane.panes = tempPanes;
    }
  });
  return parentPane;
}
