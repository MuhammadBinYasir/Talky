"use client";
import React, { createContext, useEffect, useState, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "@/context/UserContext";

export type OnlineUsersType = { [userId: string]: string };

interface ServerContextType {
  socket: Socket | null;
  onlineUsers: OnlineUsersType | null;
}

export const ServerContext = createContext<ServerContextType>({
  socket: null,
  onlineUsers: null,
});

export const ServerProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsersType | null>(null);

  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    const userId = String(user.id).trim();
    const newSocket = io("http://localhost:4000/", {
      query: { id: userId },
    });

    // Debugging connection
    newSocket.on("connect", () => {
      console.log(`🟢 ${userId} connected with socket ID:`, newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error(`🔴 ${userId} connection failed:`, err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?.id]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("getOnlineUsers");

    socket.on("onlineUsers", (data: OnlineUsersType) => {
      setOnlineUsers(data);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, [socket]);

  return (
    <ServerContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </ServerContext.Provider>
  );
};

export const useServer = () => useContext(ServerContext);
