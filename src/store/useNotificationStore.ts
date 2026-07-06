import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export interface Notification {
  id: string;
  type: 'ORDER_CREATED' | 'STOCK_LOW' | 'SYSTEM';
  message: string;
  read: boolean;
  timestamp: Date;
  data?: unknown;
}

interface NotificationStore {
  notifications: Notification[];
  socket: Socket | null;
  unreadCount: number;
  connectSocket: () => void;
  disconnectSocket: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  socket: null,
  unreadCount: 0,
  
  connectSocket: () => {
    if (get().socket) return;
    
    let newSocket: Socket;
    try {
      newSocket = io(process.env.NEXT_PUBLIC_API_URL || '', {
        transports: ['websocket'],
        autoConnect: false,
      });
    } catch {
      console.warn('Socket connection unavailable (no real-time backend)');
      return;
    }

    newSocket.on('connect_error', () => {
      console.warn('Socket connection unavailable (no real-time backend)');
    });

    newSocket.on('ORDER_CREATED', (orderData) => {
      get().addNotification({
        type: 'ORDER_CREATED',
        message: `New order #${orderData.id.slice(-6)} received!`,
        data: orderData
      });
    });

    newSocket.on('STOCK_LOW', (stockData) => {
      get().addNotification({
        type: 'STOCK_LOW',
        message: `Warning: Low stock for ${stockData.name} (${stockData.remainingStock} left)`,
        data: stockData
      });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  addNotification: (notification) => {
    set((state) => {
      const newNotif = {
        ...notification,
        id: Math.random().toString(36).substring(7),
        read: false,
        timestamp: new Date()
      };
      
      return {
        notifications: [newNotif, ...state.notifications].slice(0, 50), // Keep last 50
        unreadCount: state.unreadCount + 1
      };
    });
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1)
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0
    }));
  },

  clearAll: () => set({ notifications: [], unreadCount: 0 })
}));
