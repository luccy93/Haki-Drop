import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface OrderState { orders: any[]; currentOrder: any | null; loading: boolean; error: string | null; }
const initialState: OrderState = { orders: [], currentOrder: null, loading: false, error: null };
export const orderSlice = createSlice({
  name: 'orders', initialState, reducers: {
    setOrders: (state, action: PayloadAction<any[]>) => { state.orders = action.payload; },
    setCurrentOrder: (state, action: PayloadAction<any>) => { state.currentOrder = action.payload; }
  }
});
export const { setOrders, setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;