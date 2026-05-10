"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io as ioClient } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import api from "@/lib/apiClient";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { token, user } = useAuth();
  const toast = useToast();

  const socketRef = useRef(null);
  const [connected, setConnected]       = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);

  /* ── Initial fetch of stored notifications when the user logs in ── */
  const refreshNotifications = useCallback(async () => {
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      const data = await api.get("/notifications?limit=20");
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      /* ignore — user may not be authed yet */
    }
  }, [token]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  /* ── Socket lifecycle: connect when authed, disconnect on logout ── */
  useEffect(() => {
    if (!token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnected(false);
      return;
    }

    const socket = ioClient({
      path: "/api/socket.io",
      auth:  { token },
      transports: ["websocket", "polling"],
      reconnectionDelay: 1500,
    });
    socketRef.current = socket;

    socket.on("connect",    () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("notification", (payload) => {
      setNotifications((prev) => {
        // de-duplicate by _id
        if (prev.some((n) => n._id === payload._id)) return prev;
        return [
          { _id: payload._id, message: payload.message, isRead: false, createdAt: payload.createdAt },
          ...prev,
        ].slice(0, 50);
      });
      setUnreadCount((c) => c + 1);
      toast.info(payload.message, { duration: 4500 });
    });

    return () => {
      socket.off("notification");
      socket.disconnect();
    };
  }, [token, toast]);

  const markAllRead = useCallback(async () => {
    try {
      await api.patch("/notifications", {});
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {/* noop */}
  }, []);

  const markOneRead = useCallback(async (id) => {
    try {
      await api.patch("/notifications", { id });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {/* noop */}
  }, []);

  return (
    <SocketContext.Provider
      value={{
        connected,
        notifications,
        unreadCount,
        refreshNotifications,
        markAllRead,
        markOneRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
}
