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
    <div className="w-full min-h-20 bg-white border-b border-b-neutral-200 flex items-center justify-between gap-3 px-4">
      <div className="flex items-center gap-3">
        <div onClick={() => setSelectedUser(null)}>
          <ChevronLeft className="w-6 h-6 text-neutral-800" />
        </div>
        <div className="w-10 h-10 rounded-full relative">
          <Image
            width={40}
            height={40}
            alt=""
            src="/assets/profile.png"
            className="w-full h-full rounded-full"
          />
          <div className="absolute w-4 h-4 rounded-full bg-green-400 -right-1 bottom-0 border-4 border-white"></div>
        </div>
        <div className="space-y-0.5">
          <h4 className="text-md text-neutral-800 font-semibold">
            {user?.name}
          </h4>
          <div className="flex gap-2">
            <div className="text-xs bg-sky-50 rounded-full pl-2 pr-4 py-[2px] w-max text-sky-800 flex items-center gap-2">
              <p className="w-2 h-2 rounded-full bg-sky-800"></p>{" "}
              {selectedUser &&
              onlineUsers &&
              isUserOnline(selectedUser, onlineUsers)
                ? "Online"
                : "Offline"}
            </div>
            <p className="text-xs bg-yellow-50 rounded- md:flex hidden pl-2 pr-4 py-[2px] w-max text-yellow-800 items-center gap-2">
              <Calendar className="text-yellow-800 w-3 h-3" />
              {formatDateAsDMY({ date: user?.createdAt })}
            </p>
            <p className="text-xs bg-purple-50 rounded-full pl-2 md:flex hidden pr-4 py-[2px] w-max text-purple-700 items-center gap-2">
              <MessageCircle className="text-purple-800 w-3 h-3" />
              {messages.length} Messages
            </p>
          </div>
        </div>
      </div>
      <div className="cursor-pointer" onClick={() => setViewInfo(!viewInfo)}>
        <Info className="w-5 h-5" />
      </div>
    </div>
  );
};

export default ChatUser;
