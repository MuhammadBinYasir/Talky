import ResponsiveSidebar from "@/components/ResponsiveSidebar";
import { RouteChangeHandler } from "@/components/RouteHandler";
import { MessageProvider, useMessage } from "@/context/MessageContext";
import { ServerProvider } from "@/context/ServerContext";
import { UserProvider } from "@/context/UserContext";

import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <MessageProvider>
        <ServerProvider>
          <ResponsiveSidebar>{children}</ResponsiveSidebar>
          <RouteChangeHandler />
        </ServerProvider>
      </MessageProvider>
    </UserProvider>
  );
};

export default layout;
