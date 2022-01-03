import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    panes: []
}

export const paneSlice = createSlice({
    name: "panes",
    initialState,
    reducers: {
        addPane: (state, filename) => {
            state.panes.push(filename)
        },
        removePane: (state, filename) => {
            var index = state.panes.indexOf(filename);
            state.panes.splice(index, 1);
        }
    }
})

const { reducer } = paneSlice;
export const { addPane, removePane } = paneSlice.actions;

export default reducer;
