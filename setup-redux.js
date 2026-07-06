const fs = require('fs');

const authSlice = `import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface AuthState { isAuthenticated: boolean; token: string | null; loading: boolean; error: string | null; }
const initialState: AuthState = { isAuthenticated: false, token: null, loading: false, error: null };
export const authSlice = createSlice({
  name: 'auth', initialState, reducers: {
    setAuth: (state, action: PayloadAction<{ token: string }>) => { state.isAuthenticated = true; state.token = action.payload.token; },
    logout: (state) => { state.isAuthenticated = false; state.token = null; }
  }
});
export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;`;

const userSlice = `import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface UserState { profile: any | null; loading: boolean; error: string | null; }
const initialState: UserState = { profile: null, loading: false, error: null };
export const userSlice = createSlice({
  name: 'user', initialState, reducers: {
    setUser: (state, action: PayloadAction<any>) => { state.profile = action.payload; },
    clearUser: (state) => { state.profile = null; }
  }
});
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;`;

const productSlice = `import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface ProductState { items: any[]; loading: boolean; error: string | null; }
const initialState: ProductState = { items: [], loading: false, error: null };
export const productSlice = createSlice({
  name: 'products', initialState, reducers: {
    setProducts: (state, action: PayloadAction<any[]>) => { state.items = action.payload; }
  }
});
export const { setProducts } = productSlice.actions;
export default productSlice.reducer;`;

const orderSlice = `import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface OrderState { orders: any[]; currentOrder: any | null; loading: boolean; error: string | null; }
const initialState: OrderState = { orders: [], currentOrder: null, loading: false, error: null };
export const orderSlice = createSlice({
  name: 'orders', initialState, reducers: {
    setOrders: (state, action: PayloadAction<any[]>) => { state.orders = action.payload; },
    setCurrentOrder: (state, action: PayloadAction<any>) => { state.currentOrder = action.payload; }
  }
});
export const { setOrders, setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;`;

const dashboardSlice = `import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface DashboardState { metrics: any | null; loading: boolean; error: string | null; }
const initialState: DashboardState = { metrics: null, loading: false, error: null };
export const dashboardSlice = createSlice({
  name: 'dashboard', initialState, reducers: {
    setMetrics: (state, action: PayloadAction<any>) => { state.metrics = action.payload; }
  }
});
export const { setMetrics } = dashboardSlice.actions;
export default dashboardSlice.reducer;`;

const notificationSlice = `import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface NotificationState { notifications: any[]; unreadCount: number; }
const initialState: NotificationState = { notifications: [], unreadCount: 0 };
export const notificationSlice = createSlice({
  name: 'notifications', initialState, reducers: {
    addNotification: (state, action: PayloadAction<any>) => { state.notifications.unshift(action.payload); state.unreadCount++; },
    markAllRead: (state) => { state.unreadCount = 0; }
  }
});
export const { addNotification, markAllRead } = notificationSlice.actions;
export default notificationSlice.reducer;`;

const store = `import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
import dashboardReducer from './slices/dashboardSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    products: productReducer,
    orders: orderReducer,
    dashboard: dashboardReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`;

const provider = `'use client';
import { Provider } from 'react-redux';
import { store } from './store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}`;

fs.writeFileSync('src/store/redux/slices/authSlice.ts', authSlice);
fs.writeFileSync('src/store/redux/slices/userSlice.ts', userSlice);
fs.writeFileSync('src/store/redux/slices/productSlice.ts', productSlice);
fs.writeFileSync('src/store/redux/slices/orderSlice.ts', orderSlice);
fs.writeFileSync('src/store/redux/slices/dashboardSlice.ts', dashboardSlice);
fs.writeFileSync('src/store/redux/slices/notificationSlice.ts', notificationSlice);
fs.writeFileSync('src/store/redux/store.ts', store);
fs.writeFileSync('src/store/redux/ReduxProvider.tsx', provider);
