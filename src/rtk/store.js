import { configureStore } from "@reduxjs/toolkit"
import reportDashboardReducer from "./reportDashboard/slices"
import profileDashboardReducer from "./profileDashboard/slices";

const reducer = {
    reportDashboards: reportDashboardReducer,
    profileDashboard: profileDashboardReducer
}

const store = configureStore({
    reducer: reducer,
    devTools: true,
})

export default store;
