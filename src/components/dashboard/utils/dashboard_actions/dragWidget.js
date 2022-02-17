import { replacePaneInTree } from "./addWidget";
import { replacePanesMakeEmpty } from "./removeWidget";
import { generateSplitter, generateWidget } from "../tools/widgetGenerator";

export default function drag_widget(tree, data, direction) {
  let treeStructure;
  let except;
  let panes = data.payload;

  [treeStructure, except] = moveBothWidgetToNewSplitter(tree, panes, treeStructure);

  treeStructure = removePreviousChildren(panes[0], tree, treeStructure, except)

  return treeStructure;
}

function moveBothWidgetToNewSplitter(tree, panes, treeStructure) {
  console.log(`Dragged from ${panes[0]} to ${panes[1]}`);
  let fromData = findPaneInDashboard([tree], panes[0], {});
  let toData = findPaneInDashboard([tree], panes[1], {});

  // toPane, parent, index
  let toPane = toData[0];
  let fromPane = fromData[0];
  let parent = toData[1];
  let index = toData[2];
  let split = "vertical";
  if (toPane["height"] > toPane["width"]) {
    split = "horizontal";
  }
  let splitterObj = generateSplitter(
    "",
    toPane["height"],
    toPane["width"],
    split,
    [toPane, fromPane]
  );

  let tempPanes = [...parent["panes"]];
  tempPanes.splice(index, 1, splitterObj);
  parent = { ...parent, panes: tempPanes };

  if (tree["key"] == parent["key"]) {
    treeStructure = parent;
  } else {
    let parentPane = replacePaneInTree({ ...tree }, parent);
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
  let pane = generateWidget("", 0, 0, "vertical", key);
  if (pane.key == treeStructure.key) {
    treeStructure = {};
  } else {
    let parentPane = replacePanesMakeEmpty(
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
    let tempPanes;
    let comingPane;
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
    let tempPanes;
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
