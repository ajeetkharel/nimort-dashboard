import { createSlice, current } from "@reduxjs/toolkit";

var empty_dash = {
  key: "Dashboard",
  panes: [],
  split: "horizontal",
  height: 800,
  width: 1132,
  data: "#ffcdd2",
};

let count = 1;

function uuidv4() {
  return count++;
}

function widget(height, width, split = "vertical", key = uuidv4()) {
  return {
    key: key,
    split: split,
    panes: [],
    height: height,
    width: width,
    data: "#ffcdd2",
  };
}

function splitter(
  height,
  width,
  split = "vertical",
  key = `Splitter ${uuidv4()}`,
  pane = widget(height, width)
) {
  return {
    key: key,
    split: split,
    panes: [pane],
    height: height,
    width: width,
    data: "#ffcdd2",
  };
}

const initialState = {
  structure: {},
};

function isSplitter(pane) {
  if (pane["panes"].length == 2) {
    return true;
  }
  return false;
}

function splitVertically(pane) {
  var height = pane["height"];
  var width = pane["width"];
  var newWidth = ~~(width / 2);

  var childPane = widget(height, newWidth);
  return {
    ...pane,
    split: "vertical",
    panes: [{ ...pane.panes[0], width: newWidth }, childPane],
  };
}

function splitHorizontally(pane) {
  var width = pane["width"];
  var height = pane["height"];
  var newHeight = ~~(height / 2);

  var childPane = widget(newHeight, width);
  return {
    ...pane,
    split: "horizontal",
    panes: [{ ...pane.panes[0], height: newHeight }, childPane],
  };
}

function getArea(pane) {
  var height = pane["height"];
  var width = pane["width"];
  return height * width;
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

function getPaneWithHighestArea(structure) {
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

function addNewPane(structure) {
  var [pane, toSplit, parent] = getPaneWithHighestArea(structure);
  if (toSplit) {
    var splitterObj = splitter(
      pane["height"],
      pane["width"],
      pane["split"],
      `Splitter ${uuidv4()}`,
      pane
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

function replacePanes(parentPane, newPane) {
  parentPane.panes.forEach((pane, idx) => {
    var tempPanes;
    if (pane.key === newPane.key) {
      tempPanes = [...parentPane.panes];
      tempPanes[idx] = newPane;
      parentPane.panes = tempPanes;
    } else if (pane.panes.length > 0) {
      pane = replacePanes({ ...pane }, newPane);
      tempPanes = [...parentPane.panes];
      tempPanes[idx] = pane;
      parentPane.panes = tempPanes;
    }
  });
  return parentPane;
}

function replacePanesMakeEmpty(parentPane, newPane) {
  parentPane.panes.forEach((pane, idx) => {
    var tempPanes;
    var comingPane;
    if (pane.key === newPane.key) {
      tempPanes = [...parentPane.panes];
      tempPanes.splice(idx, 1);
      parentPane.panes = tempPanes;
    } else if (pane.panes.length > 0) {
      comingPane = replacePanesMakeEmpty({ ...pane }, newPane);
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

export const paneSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    addWidget: (state = initialState) => {
      if (current(state).structure["key"] == undefined) {
        state.structure = splitter(800, 1156);
      } else {
        var [pane, splitterObj, toSplit, index] = addNewPane(
          current(state).structure
        );
        if (toSplit) {
          var tempPanes = [...pane["panes"]];
          tempPanes.splice(index, 1, splitterObj);
          pane = { ...pane, panes: tempPanes };
        }
        if (current(state).structure["key"] == pane["key"]) {
          state.structure = pane;
        } else {
          var parentPane = replacePanes({ ...current(state).structure }, pane);
          state.structure = parentPane;
        }
      }
    },
    removePane: (state, key) => {
      var pane = widget(0, 0, "vertical", key.payload);
      if (pane.key == state.structure.key) {
        state.structure = initialState;
      } else {
        var parentPane = replacePanesMakeEmpty(
          { ...current(state).structure },
          pane
        );
        if (parentPane.panes.length == 0) {
          state.structure = {};
        } else {
          state.structure = parentPane;
        }
      }
    },
    maximize: (state, key) => {},
  },
});

const { reducer } = paneSlice;
export const { addWidget, removePane } = paneSlice.actions;

export default reducer;
