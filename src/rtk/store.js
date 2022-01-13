import { configureStore } from "@reduxjs/toolkit"
import dashboardReducer from "./dashboard/slices"

const reducer = {
    dashboard: dashboardReducer
}

const store = configureStore({
    reducer: reducer,
    devTools: true,
})

export default store;
