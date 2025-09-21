import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    name?: string;
    email: string;
    image?: string;
}

interface AuthState {
    isAuthenticated: boolean,
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState:AuthState = {
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
            state.error = null;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    }
});

export const { loginFailure, loginSuccess, logout, setLoading, setUser} = authSlice.actions;
export default authSlice.reducer;