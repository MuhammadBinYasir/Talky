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
    const serverUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:4000/";
    const newSocket = io(serverUrl, {
      query: { id: userId },
    });

    // Event listeners
    newSocket.on("connect", () => {
      console.log(`🟢 Online: ${userId}`);
      newSocket.emit("getOnlineUsers");
    });

    newSocket.on("onlineUsers", (data: OnlineUsersType) => {
      setOnlineUsers(data);
    });

    newSocket.on("connect_error", (err) => {
      console.error(`🔴 Socket Error:`, err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.off("onlineUsers");
      newSocket.disconnect();
    };
  }, [user?.id]);

  return (
    <ServerContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </ServerContext.Provider>
  );
};

export const useServer = () => useContext(ServerContext);
