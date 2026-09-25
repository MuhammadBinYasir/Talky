"use client";
import { useState } from "react";
import ChatUser from "@/components/ChattingArea/ChatUser";
import { Message as MessageTypes, User } from "@/lib/generated/prisma";
import MsgType from "@/components/ChattingArea/MsgType";
import ChattingArea from "@/components/ChattingArea/ChattingArea";
import { useMessage } from "@/context/MessageContext";
import UserInfo from "@/components/UserInfo";
import SelectChatUser from "@/components/Errors/SelectChatUser";

/**
 * Main Chat Dashboard Page
 * 
 * Final Solution for Dynamic Heights:
 * We use 'flex-1 min-h-0' for the message area. This allows it to automatically
 * shrink when the 'MsgType' (input area) expands with an image preview.
 */
export default function Home() {
  const [messages, setMessages] = useState<MessageTypes[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [viewInfo, setViewInfo] = useState(false);
  const { selectedUser } = useMessage();
  const [tempMsg, setTempMsg] = useState<MessageTypes | null>(null);

  if (!selectedUser)
    return (
      <div className="h-full flex flex-col bg-slate-50/50">
        <SelectChatUser />
      </div>
    );

  return (
    <div className="h-full grid grid-cols-4 overflow-hidden relative bg-white max-h-screen">
      {/* 🟢 MAIN CHAT CONTAINER (Flex-Column) */}
      <div
        className={`relative flex flex-col border-r max-h-screen border-slate-200 h-full transition-all duration-300 ${viewInfo ? "col-span-4 lg:col-span-3" : "col-span-4"
          }`}
      >
        {/* 1. HEADER (Fixed Height 80px) */}
        <div className="h-20 shrink-0">
          <ChatUser data={{ messages, user, viewInfo, setViewInfo }} />
        </div>

        {/* 2. CHAT AREA (Flexible height, scrollable) */}
        {/* 'min-h-0' is CRITICAL here to allow the container to shrink below its content height */}
        <div className="flex-1 min-h-0 relative bg-slate-50/10">
          <ChattingArea data={{ messages, setMessages, user, setUser, tempMsg }} />
        </div>

        {/* 3. INPUT AREA (Dynamic height but doesn't grow indefinitely) */}
        <div className="shrink-0 bg-white/70 backdrop-blur-md border-t border-slate-200/50">
          <MsgType data={{ setTempMsg, setMessages, oppUser: user }} />
        </div>
      </div>

      {/* 🔴 RIGHT SIDEBAR (UserInfo) */}
      <div className={`bg-white h-screen transition-all duration-500 absolute lg:relative right-0 top-0 ${viewInfo ? "w-full lg:w-auto lg:col-span-1 shadow-2xl z-20" : "hidden"
        } border-l border-slate-200`}>
        <UserInfo data={{ setViewInfo, oppUser: user }} />
      </div>
    </div>
  );
}
