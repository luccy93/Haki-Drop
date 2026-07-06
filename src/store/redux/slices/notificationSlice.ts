import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export interface NotificationState { notifications: any[]; unreadCount: number; }
const initialState: NotificationState = { notifications: [], unreadCount: 0 };
export const notificationSlice = createSlice({
  name: 'notifications', initialState, reducers: {
    addNotification: (state, action: PayloadAction<any>) => { state.notifications.unshift(action.payload); state.unreadCount++; },
    markAllRead: (state) => { state.unreadCount = 0; }
  }
});
export const { addNotification, markAllRead } = notificationSlice.actions;
export default notificationSlice.reducer;