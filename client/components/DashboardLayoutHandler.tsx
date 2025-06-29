"use client";
import { useMessage } from "@/context/MessageContext";
import { usePathname } from "next/navigation";
import React from "react";

const DashboardLayoutHandler = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { selectedUser } = useMessage();

  const pathname = usePathname();

  if (pathname != "/" && !selectedUser) return <>{children}</>;

  if (pathname === "/" && !selectedUser)
    return <p>Select a user to start a chat with 😀</p>;

  return <>{children}</>;
};

export default DashboardLayoutHandler;
