import {createSlice} from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notifications",
    initialState: [],
    reducers: {
        addNotification: (state, action) => {
            if (action.payload !== null) {
                // Ensure unique notifications by checking timestamp
                if (!state.find(notification => notification.timestamp === action.payload.timestamp)) {
                    state.unshift(action.payload);
                }
            }
        },
        removeNotification: (state, action) => {
            if (action.payload !== null && action.payload.timestamp !== undefined) { // Check timestamp is present
                const index = state.findIndex(notification => notification.timestamp === action.payload.timestamp);
                if (index !== -1) {
                    state.splice(index, 1);
                }
            }
        },
        markSeen: (state) => {
            state.forEach(notificationItem => {
                notificationItem.seen = true
            })
        },
        clearNotifications: () => {
            return []
        }
    }
})

export const {addNotification, clearNotifications, removeNotification, markSeen} = notificationSlice.actions // Export markSeen
export default notificationSlice.reducer