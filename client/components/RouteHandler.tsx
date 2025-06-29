"use client";
import { useMessage } from "@/context/MessageContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const RouteChangeHandler = () => {
  const pathname = usePathname();
  const { selectedUser, setSelectedUser } = useMessage();

  useEffect(() => {
    if (pathname !== "/" && selectedUser) {
      setSelectedUser(null);
    }
  }, [pathname, selectedUser, setSelectedUser]);

  return null;
};
