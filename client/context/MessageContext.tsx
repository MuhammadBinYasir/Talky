"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface MessageContextType {
  selectedUser: string | null;
  setSelectedUser: (id: string | null) => void;
  viewInfo: boolean;
  setViewInfo: (boolean: boolean) => void;
}

const MessageContext = createContext<MessageContextType>({
  selectedUser: null,
  setSelectedUser: () => {},
  viewInfo: false,
  setViewInfo: () => {},
});

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [viewInfo, setViewInfo] = useState<boolean>(false);
  useEffect(() => {
    const localUserId = localStorage.getItem("selectedUser");
    if (localUserId) {
      setSelectedUser(localUserId);
    }
  }, []);

  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem("selectedUser", selectedUser);
    } else {
      localStorage.removeItem("selectedUser");
    }
  }, [selectedUser]);

  return (
    <MessageContext.Provider
      value={{ selectedUser, setSelectedUser, viewInfo, setViewInfo }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
