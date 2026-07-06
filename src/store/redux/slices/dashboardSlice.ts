import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface DashboardState { metrics: any | null; loading: boolean; error: string | null; }
const initialState: DashboardState = { metrics: null, loading: false, error: null };
export const dashboardSlice = createSlice({
  name: 'dashboard', initialState, reducers: {
    setMetrics: (state, action: PayloadAction<any>) => { state.metrics = action.payload; }
  }
});
export const { setMetrics } = dashboardSlice.actions;
export default dashboardSlice.reducer;