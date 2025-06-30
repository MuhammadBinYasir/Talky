"use client";
import React, { Suspense, useState } from "react";
import DashboardLayoutHandler from "./DashboardLayoutHandler";
import { useMessage } from "@/context/MessageContext";
import { MessageCircle, SearchIcon, UserPlus2Icon, Users2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SidebarUser from "./SidebarUser/SidebarUser";
import { useUser } from "@/context/UserContext";
import UserInfo from "./UserInfo";
import { usePathname } from "next/navigation";
import Topbar from "./Topbar";

const ResponsiveSidebar = ({ children }: { children: React.ReactNode }) => {
  const { selectedUser, viewInfo, setViewInfo } = useMessage();

  const pathname = usePathname();
  return (
    <div
      className={`grid grid-cols-4 min-h-screen max-h-screen
     `}
    >
      <div
        className={`bg-white lg:block lg:col-span-1 col-span-4 p-4 border-r border-r-neutral-200 ${
          selectedUser ? "lg:block hidden" : "block"
        }
        ${pathname !== "/" ? "lg:block hidden" : "block"}`}
      >
        <Topbar />
        <div className="relative mt-8">
          <input
            type="text"
            placeholder="Search a user"
            className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm placeholder:text-gray-400"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <SearchIcon className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <SidebarUser />
        </div>{" "}
        {/* <Suspense fallback={<div>Loading Sidebar...</div>}>
        </Suspense> */}
      </div>
      {children}
    </div>
  );
};

export default ResponsiveSidebar;
