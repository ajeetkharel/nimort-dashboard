import { replacePaneInTree } from "./addWidget";
import { replacePanesMakeEmpty } from "./removeWidget";
import { generateSplitter, generateWidget } from "../tools/widgetGenerator";
import { updateSizeInLocalStorage } from "../tools/helpers";

let HORIZONTAL = ['top', 'bottom'];
// let VERTICAL = ['left', 'right'];

let FIRST_POSITIONS = ['top', 'left'];
// let SECOND_POSITIONS = ['bottom', 'right']


export default function drag_widget(tree, drag_data) {
  let dashTree;

  console.log(`Dragged from ${drag_data.from} to ${drag_data.to} direction ${drag_data.direction}`);

  let fromData = findPaneInDashboard([tree], drag_data.from, {}, {});
  let toData = findPaneInDashboard([tree], drag_data.to, {}, {});

  // toPane, parent, index
  let toPane = toData[0];
  let fromPane = fromData[0];
  let parent = toData[1];
  let index = toData[2];
  let grandParent = toData[3];


  let split = 'vertical';
  if (HORIZONTAL.includes(drag_data.direction)) {
    split = 'horizontal';
  }

  let panes = [{ ...toPane, size: 50 }, { ...fromPane, size: 50 }]

  if (FIRST_POSITIONS.includes(drag_data.direction)) {
    panes = [{ ...fromPane, size: 50 }, { ...toPane, size: 50 }]
  }

  updateSizeInLocalStorage(toPane, 50);
  updateSizeInLocalStorage(fromPane, 50);

  let splitterObj;
  if (parent.panes.indexOf(fromPane) != -1) {
    parent = { ...parent, split: split, panes: panes }
    splitterObj = parent;
  }
  else {
    let splitterSize = Math.round(window.localStorage.getItem("SizeOf" + toPane["key"]) || toPane["size"]);
    splitterObj = generateSplitter(
      "",
      100,
      splitterSize,
      split,
      panes
    );
    updateSizeInLocalStorage(splitterObj, splitterSize);
    let tempPanes = [...parent["panes"]];
    tempPanes.splice(index, 1, splitterObj);

    if (grandParent.panes && grandParent.panes.indexOf(fromPane) != -1) {
      const parentSize = parent["size"] + fromPane["size"];
      parent = { ...parent, size: parentSize, panes: tempPanes };
      updateSizeInLocalStorage(parent, parentSize);
    }
    else {
      parent = { ...parent, panes: tempPanes };
    }
  }
  if (tree["key"] == parent["key"]) {
    dashTree = parent;
  } else {
    let parentPane = replacePaneInTree({ ...tree }, parent);
    dashTree = parentPane;
  }

  let pane = generateWidget("", 0, "vertical", drag_data.from);
  if (pane.key == dashTree.key) {
    dashTree = {};
  } else {
    let parentPane = replacePanesMakeEmptyForDrag(
      { ...dashTree },
      pane,
      splitterObj.key
    );
    if (parentPane.panes.length == 0) {
      dashTree = {};
    } else {
      dashTree = removeLoneParents(parentPane);
    }
  }
  return dashTree;
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
      let savedSize = Math.round(window.localStorage.getItem("SizeOf" + pane["key"]));
      tempPane = { ...pane.panes[0], size: savedSize || pane["size"] };
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
