import { getArea } from "./ui_tools";

export function isSplitter(pane) {
  if (pane["panes"].length == 2) {
    return true;
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
      var area = getArea(pane);
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
  var highest = 0;
  var highestPane = structure;
  var toSplit = false;
  var details = findHighestAreaInSplitter(
    highest,
    highestPane,
    toSplit,
    [structure],
    structure,
    structure
  );
  return [details[1], details[2], details[4]];
}
