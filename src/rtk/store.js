import { configureStore } from "@reduxjs/toolkit"
import paneReducer from "./panes/slices";
import dashboardReducer from "./dashboard/slices"

const reducer = {
    panes: paneReducer,
    dashboard: dashboardReducer
}

const store = configureStore({
    reducer: reducer,
    devTools: true,
})

export default store;
