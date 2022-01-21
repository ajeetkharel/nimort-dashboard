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
  pane = [widget(height, width)]
) {
  return {
    key: key,
    split: split,
    panes: [...pane],
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

function findPane(panes, key, need_parent, neededPane, parent, neededParent, idx) {
  panes.forEach((pane, index) => {
    if (isSplitter(pane)) {
      if (need_parent) {
        [neededPane, neededParent, idx] = findPane(pane["panes"], key, need_parent, neededPane, pane, neededParent, idx);
      }
      else{
        neededPane = findPane(pane["panes"], key, need_parent, neededPane, pane, neededParent, idx);
      }
    } else {
      if (pane["key"] == key) {
        neededPane = pane;
        neededParent = parent;
        idx = index;
      }
    }
  });
  if (need_parent) {
    return [neededPane, neededParent, idx]
  }
  return neededPane;
}

function findPaneInDashboard(parentPane, key, need_parent = false) {
  let pane;
  let parent;
  let neededParent;
  let idx;
  console.log(`finding ${key}`);
  return findPane([parentPane], key, need_parent, pane, parent, neededParent, idx); 
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

function replacePanesMakeEmpty(parentPane, newPane, except=-1) {
  parentPane.panes.forEach((pane, idx) => {
    var tempPanes;
    var comingPane;
    if (pane.key === newPane.key) {
      if (parentPane.key != except){
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

function goDeep(dictlist, value, parent) {
  for (let i = 0; i < dictlist.length; i++) {
    if(dictlist[i]["key"] == value) {
      return [dictlist[i], parent, i];
    }
    
    if (dictlist[i]["panes"].length > 0) {
      return goDeep(dictlist[i]["panes"], value, dictlist[i]);
    }
  }
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
    draggedInto: (state, data) => {
      var panes = data.payload;
      console.log(`Dragged from ${panes[0]} to ${panes[1]}`);
      console.log(panes[0]);
      // var fromData = goDeep([current(state).structure], panes[0], {});
      // var toData = goDeep([current(state).structure], panes[1], {});
      var fromPane = findPaneInDashboard(current(state).structure, panes[0]);
      var toData = findPaneInDashboard(
      current(state).structure,
        panes[1],
        true
      );

      // toPane, parent, index
      var toPane = toData[0];
      // var fromPane = fromData[0];
      var parent = toData[1];
      var index = toData[2];
      var split = "vertical";
      if (toPane["height"] > toPane["width"]) {
        split = "horizontal";
      }
      var splitterObj = splitter(
        toPane["height"],
        toPane["width"],
        split,
        `Splitter ${uuidv4()}`,
        [toPane, fromPane]
      );

      var tempPanes = [...parent["panes"]];
      tempPanes.splice(index, 1, splitterObj);
      parent = { ...parent, panes: tempPanes };

      if (current(state).structure["key"] == parent["key"]) {
        state.structure = parent;
      } else {
        var parentPane = replacePanes({ ...current(state).structure }, parent);
        state.structure = parentPane;
      }

      var pane = widget(0, 0, "vertical", panes[0]);
      if (pane.key == state.structure.key) {
        state.structure = initialState;
      } else {
        var parentPane = replacePanesMakeEmpty(
          { ...current(state).structure },
          pane,
          splitterObj.key
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
export const { addWidget, removePane, draggedInto } = paneSlice.actions;

export default reducer;
