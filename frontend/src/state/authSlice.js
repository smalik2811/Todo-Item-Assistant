import {createSlice} from "@reduxjs/toolkit";

// Helper to get initial state from localStorage
const getInitialAuthState = () => {
    try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('access_token');
        const storedIsAuthenticated = localStorage.getItem('isAuthenticated');

        if (storedIsAuthenticated === 'true' && storedUser && storedToken) {
            return {
                isAuthenticated: true,
                user: JSON.parse(storedUser),
                access_token: storedToken,
            };
        }
    } catch (error) {
        console.error("Error reading auth state from localStorage", error);
    }
    // Default initial state if nothing in localStorage or error
    return {
        isAuthenticated: false,
        user: null,
        access_token: null,
    };
};

const authSlice = createSlice({
    name: "auth",
    initialState: getInitialAuthState(),
    reducers: {
        login: (state, action) => {
            if (action.payload.user !== null) {
                state.isAuthenticated = true
                state.user = action.payload.user
                state.access_token = action.payload.access_token
                // Persist to localStorage
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                localStorage.setItem('access_token', action.payload.access_token);
            }
        },
        logout: (state) => {
            state.isAuthenticated = false
            state.access_token = null
            state.user = null
            // Clear from localStorage
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
            localStorage.removeItem('access_token');
        }
    }
})

export const {login, logout} = authSlice.actions
export default authSlice.reducer