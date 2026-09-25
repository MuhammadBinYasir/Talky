"use client";
import { useMessage } from "@/context/MessageContext";
import { OnlineUsersType, useServer } from "@/context/ServerContext";
import { useUser } from "@/context/UserContext";
import { Message, User } from "@/lib/generated/prisma";
import { formatDateAsDMY, isUserOnline } from "@/lib/utils";
import { Calendar, ChevronLeft, Info, MessageCircle } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Socket } from "socket.io-client";
import ChatUserLoading from "./ChatUserLoading";

const ChatUser = ({
  data: { messages, user, setViewInfo, viewInfo },
}: {
  data: {
    messages: Message[];
    user: User | null;
    viewInfo: boolean;
    setViewInfo: (viewInfo: boolean) => void;
  };
}) => {
  const { selectedUser, setSelectedUser } = useMessage();
  const { onlineUsers } = useServer();
  if (!user) return <ChatUserLoading />;
  
  return (
    <div className="w-full h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 z-10 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSelectedUser(null)}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-full transition-colors mr-1"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        
        <div className="relative group cursor-pointer">
          <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-slate-100 ring-offset-2 transition-all group-hover:ring-sky-200">
            <Image
              width={44}
              height={44}
              alt={user.name}
              src={user.image || "/profile.png"}
              className="w-full h-full object-cover"
            />
          </div>
          {selectedUser && onlineUsers && isUserOnline(selectedUser, onlineUsers) && (
            <div className="absolute w-3.5 h-3.5 rounded-full bg-emerald-500 right-0 bottom-0 border-2 border-white animate-pulse" />
          )}
        </div>

        <div className="flex flex-col">
          <h4 className="text-[15px] text-slate-900 font-bold leading-tight">
            {user.name}
          </h4>
          <span className={`text-[11px] font-medium uppercase tracking-wider ${
            selectedUser && onlineUsers && isUserOnline(selectedUser, onlineUsers)
              ? "text-emerald-600"
              : "text-slate-400"
          }`}>
            {selectedUser && onlineUsers && isUserOnline(selectedUser, onlineUsers)
              ? "Active Now"
              : "Offline"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex gap-3 mr-4">
          <div className="flex flex-col items-end opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Joined</span>
            <span className="text-[11px] text-slate-600 font-semibold">
              {formatDateAsDMY({ date: user?.createdAt })}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => setViewInfo(!viewInfo)}
          className={`p-2.5 rounded-full transition-all duration-300 ${
            viewInfo ? "bg-sky-50 text-sky-600" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          }`}
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatUser;
