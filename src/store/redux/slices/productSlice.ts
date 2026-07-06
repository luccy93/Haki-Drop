import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface ProductState { items: any[]; loading: boolean; error: string | null; }
const initialState: ProductState = { items: [], loading: false, error: null };
export const productSlice = createSlice({
  name: 'products', initialState, reducers: {
    setProducts: (state, action: PayloadAction<any[]>) => { state.items = action.payload; }
  }
});
export const { setProducts } = productSlice.actions;
export default productSlice.reducer;