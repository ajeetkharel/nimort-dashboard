import { createSlice, current } from "@reduxjs/toolkit";
import { addFigureInDashboard, replacePaneInTree } from "../../components/dashboard/utils/dashboard_actions/addFigure";
import { findPaneInDashboard, removeLoneParents, replacePanesMakeEmptyForDrag } from "../../components/dashboard/utils/dashboard_actions/dragFigure";
import { removeFigureFromDashboard, replacePanesMakeEmpty } from "../../components/dashboard/utils/dashboard_actions/removeFigure";
import { exportToJsonFile, setSavedSizeOfPanes, updateSizeInLocalStorage } from "../../components/dashboard/utils/tools/helpers";
import { generateSplitter, generateWidget } from "../../components/dashboard/utils/tools/widgetGenerator";

const initialState = {
  tree: {},
};

let HORIZONTAL = ['top', 'bottom'];
// let VERTICAL = ['left', 'right'];

let FIRST_POSITIONS = ['top', 'left'];
// let SECOND_POSITIONS = ['bottom', 'right']


export const paneSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    addFigure: (state = initialState) => {
      state.tree = addFigureInDashboard(current(state).tree);
    },
    removeFigure: (state, key) => {
      state.tree = removeFigureFromDashboard(current(state).tree, key);
    },
    draggedInto: (state, data) => {
      let drag_data = data.payload;
      console.log(`Dragged from ${drag_data.from} to ${drag_data.to} direction ${drag_data.direction}`);

      let fromData = findPaneInDashboard([current(state).tree], drag_data.from, {}, {});
      let toData = findPaneInDashboard([current(state).tree], drag_data.to, {}, {});

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
          updateSizeInLocalStorage(parent, parentSize)
        }
        else {
          parent = { ...parent, panes: tempPanes };
        }
      }
      if (current(state).tree["key"] == parent["key"]) {
        state.tree = parent;
      } else {
        let parentPane = replacePaneInTree({ ...current(state).tree }, parent);
        state.tree = parentPane;
      }

      let pane = generateWidget(0, "vertical", drag_data.from);
      if (pane.key == state.tree.key) {
        state.tree = initialState;
      } else {
        let parentPane = replacePanesMakeEmptyForDrag(
          { ...current(state).tree },
          pane,
          splitterObj.key
        );
        if (parentPane.panes.length == 0) {
          state.tree = {};
        } else {
          state.tree = removeLoneParents(parentPane);
        }
      }
    },
    exportDashboard: (state) => {
      let dashboardTree = current(state).tree;
      if (dashboardTree["key"]) {
        dashboardTree = setSavedSizeOfPanes({ ...dashboardTree });
        exportToJsonFile(dashboardTree);
      }
    },
    importDashboard: (state, obj) => {
      state.tree = obj.payload;
    }
  },
});

const { reducer } = paneSlice;
export const { addFigure, removeFigure, draggedInto, exportDashboard, importDashboard } = paneSlice.actions;

export default reducer;
