import { getArea } from "./uiTools";
import { uuidv4 } from "./widgetGenerator";

export function isSplitter(pane) {
  if (pane["panes"].length == 2) { //isSplitter
    return true;
  }
  else if (pane["panes"].length == 1){ //itsSingleChildIsSplitter
    if(pane["panes"][0]["panes"].length > 0) {
      return true;
    }
  }
  return false;
}

function findHighestAreaInSplitter(
  highest,
  highestPane,
  toSplit,
  panes,
  parent,
  highest_parent
) {
  panes.forEach((pane) => {
    if (isSplitter(pane)) {
      [highest, highestPane, toSplit, , highest_parent] =
        findHighestAreaInSplitter(
          highest,
          highestPane,
          true,
          pane["panes"],
          pane,
          highest_parent
        );
    } else {
      if (pane.panes.length == 1) {
        toSplit = false;
      }
      let area = getArea(pane);
      if (area > highest) {
        highest = area;
        highestPane = pane;
        highest_parent = parent;
      }
    }
  });
  return [highest, highestPane, toSplit, parent, highest_parent];
}

export function getPaneWithHighestArea(structure) {
  let highest = 0;
  let highestPane = structure;
  let toSplit = false;
  let details = findHighestAreaInSplitter(
    highest,
    highestPane,
    toSplit,
    [structure],
    structure,
    structure
  );
  return [details[1], details[2], details[4]];
}

export function exportToJsonFile(jsonData) {
  let dataStr = JSON.stringify(jsonData);
  let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  let exportFileDefaultName = 'data.json';

  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

export function setSavedSizeOfPanes(parent) {
  parent.panes.forEach((pane, idx) => {
    if (isSplitter(pane)) {
      let comingPane = setSavedSizeOfPanes({...pane});
      let savedSize = Math.round(window.localStorage.getItem("SizeOf"+comingPane["key"]));
      let tempPane = {...comingPane};
      tempPane["size"] = savedSize || comingPane["size"];
      tempPane["key"] = uuidv4();
      console.log("TEHITE", tempPane);
      let tempPanes = [...parent.panes];
      tempPanes[idx] = tempPane;
      parent.panes = tempPanes;
    }
    else {
      let savedSize = Math.round(window.localStorage.getItem("SizeOf"+pane["key"]));
      let tempPane = {...pane};
      tempPane["size"] = savedSize || pane["size"];
      tempPane["key"] = uuidv4();
      let tempPanes = [...parent.panes];
      tempPanes[idx] = tempPane;
      parent.panes = tempPanes;
    }
  });
  return parent;
}

export function updateSizeInLocalStorage(pane, newSize) {
  window.localStorage.setItem("SizeOf"+pane["key"], newSize);
}


export function bulkUpdateSizeInLocalStorage(sizes, panes) {
  if (panes.length > 0) {
    for (let i = 0; i < sizes.length; i++) {
      window.localStorage.setItem("SizeOf" + panes[i]["key"], sizes[i]);
    }
  }
}