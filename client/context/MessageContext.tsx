"use client";
import { createContext, useContext, useState } from "react";

interface MessageContextType {
  selectedUser: string | null;
  setSelectedUser: (id: string | null) => void;
}

const MessageContext = createContext<MessageContextType>({
  selectedUser: null,
  setSelectedUser: () => {},
});

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  return (
    <MessageContext.Provider value={{ selectedUser, setSelectedUser }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
