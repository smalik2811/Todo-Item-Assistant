import {configureStore} from '@reduxjs/toolkit'
import authSlice from "./authSlice.js";
import tasksSlice from "./tasksSlice.js";
import notificationSlice from "./notificationSlice.js"
import summarySlice from "./summarySlice.js"

export const store = configureStore({
    reducer: {
        auth: authSlice,
        tasks: tasksSlice,
        notifications: notificationSlice,
        summary: summarySlice,
    },
    composeWithDevTools: true,
})

export default store;
