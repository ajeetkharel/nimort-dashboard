import { configureStore } from "@reduxjs/toolkit"
import reportDashboardReducer from "./dashboard/slices"

const reducer = {
    reportDashboards: reportDashboardReducer,
    profileDashboards: null
}

const store = configureStore({
    reducer: reducer,
    devTools: true,
})

export default store;
