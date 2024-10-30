import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface AuthState {
    token: string | null;
}
const storedToken = typeof window !== 'undefined' ? localStorage.getItem('__token__') : null;
const initialState: AuthState = {
    token: storedToken ?? null,
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('__token__', action.payload);
            }
        },
        clearToken: (state) => {
            state.token = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('__token__'); 
            }
        },
    },
});
export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
