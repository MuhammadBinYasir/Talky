"use client";
import { useMessage } from "@/context/MessageContext";
import { usePathname } from "next/navigation";
import React from "react";
import SelectChatUser from "./Errors/SelectChatUser";

const DashboardLayoutHandler = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { selectedUser } = useMessage();

  const pathname = usePathname();

  if (pathname != "/" && !selectedUser) return <>{children}</>;

  if (pathname === "/" && !selectedUser)
    return <SelectChatUser />;

  return <>{children}</>;
};

export default DashboardLayoutHandler;
