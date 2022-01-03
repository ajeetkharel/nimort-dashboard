import { createSlice, current } from "@reduxjs/toolkit";

var empty_dash = {
  key: "Reports",
  panes: [],
  split: "horizontal",
  height: 500,
  width: 800,
  data: "#ffcdd2"
};

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4))).toString(
      16
    )
  );
}

function widget(height, width, split="vertical", key=uuidv4()) {
  return {
    key: key,
    split: split,
    panes: [],
    height: height,
    width: width,
    data: "#ffcdd2"
  };
}

const initialState = {
  structure: empty_dash,
};

function isSplitter(pane) {
  if (pane["panes"].length > 0) {
    return true;
  }
  return false;
}

function splitVertically(pane) {
  var height = document.getElementById(pane.key).offsetHeight;
  var width = document.getElementById(pane.key).clientWidth;
  var newWidth = ~~(width / 2);

  var childPane1 = widget(height, newWidth)
  var childPane2 = widget(height, newWidth)
  return { ...pane, split: "vertical", panes: [childPane1, childPane2]};
}

function splitHorizontally(pane) {
  var width = document.getElementById(pane.key).clientWidth;
  var height = document.getElementById(pane.key).offsetHeight;
  var newHeight = ~~(height / 2);

  var childPane1 = widget(newHeight, width);
  var childPane2 = widget(newHeight, width);
  return { ...pane, split: "horizontal", panes: [childPane1, childPane2] };
}

function getArea(pane) {
  var height = document.getElementById(pane.key).offsetHeight;
  var width = document.getElementById(pane.key).clientWidth;
  return height * width;
}

function findHighestAreaInSplitter(highest, highestPane, panes) {
  panes.forEach((pane) => {
    if (isSplitter(pane)) {
      [highest, highestPane] = findHighestAreaInSplitter(
        highest,
        highestPane,
        pane["panes"]
      );
    } else {
      var area = getArea(pane);
      if (area > highest) {
        highest = area;
        highestPane = pane;
      }
    }
  });
  return [highest, highestPane];
}

function getPaneWithHighestArea(structure) {
  var n_panes = structure.panes.length;
  if (n_panes === 0) {
    return structure;
  }
  var highest = 0;
  var highestPane = structure.panes[0];
  var details = findHighestAreaInSplitter(highest, highestPane, structure.panes);
  return details[1];
}

function addNewPane(structure) {
  var pane = getPaneWithHighestArea(structure);
  if (pane.height > pane.width) {
    return  splitHorizontally(pane);
  } else {
    return  splitVertically(pane);
  }
}

function replacePanes(parentPane, newPane) {
  parentPane.panes.forEach((pane, idx) => {
    var tempPanes;
    if (pane.panes.length > 0) {
      pane = replacePanes({ ...pane }, newPane);
      tempPanes = [...parentPane.panes];
      tempPanes[idx] = pane;
      parentPane.panes = tempPanes;
    } else if (pane.key === newPane.key) {
      tempPanes = [...parentPane.panes];
      tempPanes[idx] = newPane;
      parentPane.panes = tempPanes;
    }
  });
  return parentPane;
}

function replacePanesMakeEmpty(parentPane, newPane) {
  parentPane.panes.forEach((pane, idx) => {
    var tempPanes;
    if (pane.panes.length > 0) {
      pane = replacePanes({ ...pane }, newPane);
      tempPanes = [...parentPane.panes];
      tempPanes[idx] = pane;
      parentPane.panes = tempPanes;
    }
    if (pane.key === newPane.key) {
      parentPane.panes = [];
    }
  });
  return parentPane;
}


export const paneSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    addWidget: (state = initialState) => {
      var pane = addNewPane(current(state).structure);
      if (pane.key === current(state).structure.key) {
        state.structure = pane;
      } else {
        var parentPane = replacePanes({ ...current(state).structure }, pane);
        state.structure = parentPane;
      }
    },
    removePane: (state, key) => {
      // var pane = widget(0, 0, "123", key.payload);
      // var parentPane = replacePanesMakeEmpty({ ...current(state).structure }, pane);
      // state.structure = parentPane;
    },
    maximize: (state, key) => {
      
    }
  },
});

const { reducer } = paneSlice;
export const { addWidget, removePane } = paneSlice.actions;

export default reducer;
