"use client";
import { useState } from "react";
import ChatUser from "@/components/ChattingArea/ChatUser";
import { Message as MessageTypes, User } from "@/lib/generated/prisma";
import MsgType from "@/components/ChattingArea/MsgType";
import ChattingArea from "@/components/ChattingArea/ChattingArea";
import { usePathname } from "next/navigation";
import { useMessage } from "@/context/MessageContext";
import Topbar from "@/components/Topbar";
import UserInfo from "@/components/UserInfo";

export default function Home() {
  const [messages, setMessages] = useState<MessageTypes[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [viewInfo, setViewInfo] = useState(false);
  const { selectedUser } = useMessage();
  const pathname = usePathname();

  return (
    <>
      <div
        className={`bg-neutral-100 ${
          viewInfo ? "lg:col-span-2 lg:flex hidden" : "lg:col-span-3 flex"
        } col-span-4 flex flex-col h-screen overflow-auto 
        ${
          selectedUser
            ? "flex"
            : `lg:flex ${pathname !== "/" ? "flex" : "hidden"}`
        }`}
      >
        <div
          className={`p-4 pb-0 bg-white ${
            pathname !== "/" ? "lg:hidden block" : "hidden"
          }`}
        >
          <Topbar className="border-b-0" />
        </div>
        <ChatUser data={{ messages, user, viewInfo, setViewInfo }} />
        <ChattingArea data={{ messages, setMessages, user, setUser }} />
        <MsgType />
      </div>
      <div
        className={`bg-white ${
          viewInfo ? "lg:col-span-1 col-span-4" : "hidden"
        } p-4 border-l border-l-neutral-200`}
      >
        <UserInfo data={{ setViewInfo }} />
      </div>
    </>
  );
}
