import { createSlice, current } from "@reduxjs/toolkit";
import { addWidgetInDashboard } from "../../components/dashboard/utils/dashboard_actions/addWidget";
import drag_widget from "../../components/dashboard/utils/dashboard_actions/dragWidget";
import { removeWidgetFromDashboard } from "../../components/dashboard/utils/dashboard_actions/removeWidget";
import { exportToJsonFile, setSavedSizeOfPanes } from "../../components/dashboard/utils/tools/helpers";
import { uuidv4 } from "../../components/dashboard/utils/tools/widgetGenerator";

const initialState = {
  tree: {},
  activeKey: undefined,
};



export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    addWidget: (state = initialState, data) => {
      const report = data.payload[0];
      const key = data.payload[1];

      const tree = current(state).tree[key].data;
      state.tree[key].data = addWidgetInDashboard(tree, report);
    },
    removeWidget: (state, widgetKey) => {
      state.tree[state.activeKey] = { ...state.tree[state.activeKey], data: removeWidgetFromDashboard(current(state).tree[state.activeKey].data, widgetKey) };
    },
    draggedInto: (state, data) => {
      const key = state.activeKey;
      const draggedData = drag_widget(current(state).tree[key].data, data.payload);
      console.log(draggedData);
      state.tree[key] = { ...current(state).tree[key], data: draggedData }
    },
    exportDashboard: (state) => {
      if (current(state).activeKey) {
        let dashboardTree = current(state).tree[current(state).activeKey];
        if (Object.keys(dashboardTree.data).length != 0) {
          let tempData = setSavedSizeOfPanes({ ...dashboardTree.data });
          exportToJsonFile({ ...dashboardTree, data: tempData });
        }
        else {
          alert("Cannot export empty dashboard");
        }
      }
    },
    importDashboard: (state, obj) => {
      const dashName = uuidv4();
      state.tree[dashName] = { ...obj.payload };
      state.activeKey = dashName;
    },
    addNewTab: (state) => {
      const dashName = uuidv4();
      state.tree[dashName] = {
        title: 'untitled',
        data: {}
      };
      state.activeKey = dashName;
    },
    setActiveKey: (state, key) => {
      state.activeKey = key.payload;
    },
    removeTab: (state, key) => {
      const { [key.payload]: data, ...rest } = state.tree;
      state.tree = rest;
    },
    updateTitle: (state, data) => {
      const key = data.payload[0];
      const title = data.payload[1];

      state.tree[key] = { ...current(state).tree[key], title: title }

    }
  },
});

const { reducer } = dashboardSlice;
export const { addWidget, removeWidget, draggedInto, exportDashboard, importDashboard, addEmptyTab, addNewTab, setActiveKey, removeTab, updateTitle } = dashboardSlice.actions;

export default reducer;
