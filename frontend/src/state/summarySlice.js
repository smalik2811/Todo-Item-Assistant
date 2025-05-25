import {createSlice} from "@reduxjs/toolkit";

const summarySlice = createSlice({
    name: "summary",
    initialState: null,
    reducers: {
        setSummary: (state, action) => {
            return action.payload;
        },
        clearSummary: () => {
            return null;
        },
    }
})

export const {setSummary, clearSummary} = summarySlice.actions
export default summarySlice.reducer