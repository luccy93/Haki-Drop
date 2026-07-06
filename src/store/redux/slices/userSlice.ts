import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface UserState { profile: any | null; loading: boolean; error: string | null; }
const initialState: UserState = { profile: null, loading: false, error: null };
export const userSlice = createSlice({
  name: 'user', initialState, reducers: {
    setUser: (state, action: PayloadAction<any>) => { state.profile = action.payload; },
    clearUser: (state) => { state.profile = null; }
  }
});
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;