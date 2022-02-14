import { createSlice, current } from "@reduxjs/toolkit";
import { addFigureInDashboard, replacePaneInTree } from "../../components/dashboard/utils/dashboard_actions/add_figure";
import { findPaneInDashboard } from "../../components/dashboard/utils/dashboard_actions/drag_figure";
import { removeFigureFromDashboard, replacePanesMakeEmpty } from "../../components/dashboard/utils/dashboard_actions/remove_figure";
import { generateSplitter, generateWidget } from "../../components/dashboard/utils/tools/widget_generator";

const initialState = {
  tree: {},
};

let HORIZONTAL = ['top', 'bottom'];
// let VERTICAL = ['left', 'right'];

let FIRST_POSITIONS = ['top', 'left']
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
      var drag_data = data.payload;
      console.log(`Dragged from ${drag_data.from} to ${drag_data.to}`);

      var fromData = findPaneInDashboard([current(state).tree], drag_data.from, {});
      var toData = findPaneInDashboard([current(state).tree], drag_data.to, {});

      // toPane, parent, index
      var toPane = toData[0];
      var fromPane = fromData[0];
      var parent = toData[1];
      var index = toData[2];

      let split = 'vertical';
      if (HORIZONTAL.includes(drag_data.direction)) {
        split = 'horizontal';
      }

      let panes = [toPane, fromPane]

      if (FIRST_POSITIONS.includes(drag_data.direction)) {
        panes = [fromPane, toPane]
      }

      var splitterObj = generateSplitter(
        split,
        panes,
        toPane["size"]
      );

      var tempPanes = [...parent["panes"]];
      tempPanes.splice(index, 1, splitterObj);
      parent = { ...parent, panes: tempPanes };

      if (current(state).tree["key"] == parent["key"]) {
        state.tree = parent;
      } else {
        var parentPane = replacePaneInTree({ ...current(state).tree }, parent);
        state.tree = parentPane;
      }

      var pane = generateWidget(0, "vertical", drag_data.from);
      if (pane.key == state.tree.key) {
        state.tree = initialState;
      } else {
        var parentPane = replacePanesMakeEmpty(
          { ...current(state).tree },
          pane,
          splitterObj.key
        );
        if (parentPane.panes.length == 0) {
          state.tree = {};
        } else {
          state.tree = parentPane;
        }
      }
    },
  },
});

const { reducer } = paneSlice;
export const { addFigure, removeFigure, draggedInto } = paneSlice.actions;

export default reducer;
