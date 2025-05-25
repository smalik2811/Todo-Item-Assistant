import {createSlice} from "@reduxjs/toolkit";

const tasksSlice = createSlice({
    name: "tasks",
    initialState: [],
    reducers: {
        setTasks: (state, action) => {
            // Replace current tasks with the payload
            // Assumes action.payload is an array of tasks
            return action.payload;
        },
        addTask: (state, action) => {
            if (action.payload !== null) {
                state.unshift(action.payload)
            }
        },
        removeTask: (state, action) => {
            if (action.payload !== null) {
                const index = state.findIndex(task => task.id === action.payload.id)
                if (index !== -1) {
                    state.splice(index, 1)
                }
            }
        },
        updateTask: (state, action) => {
            if (action.payload !== null) {
                const index = state.findIndex(task => task.id === action.payload.id)
                if (index !== -1) {
                    state[index] = action.payload
                }
            }
        },
        clearTasks: () => {
            return []
        }
    }
})

export const {setTasks, addTask, clearTasks, removeTask, updateTask} = tasksSlice.actions
export default tasksSlice.reducer