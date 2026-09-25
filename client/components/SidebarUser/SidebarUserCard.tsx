"use client";
import { LastMessage, countUnreadMessages } from "@/actions/MessageActions";
import { useMessage } from "@/context/MessageContext";
import { useServer } from "@/context/ServerContext";
import { useUser } from "@/context/UserContext";
import { Message, User } from "@/lib/generated/prisma";
import { isUserOnline, formatDateAsAMPM } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SidebarUserCard = ({ user }: { user: User & { isFriend?: boolean; status?: string } }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [lastMsg, setLastMsg] = useState<Message | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { selectedUser, setSelectedUser } = useMessage();
  const { user: senderUser } = useUser();
  const { onlineUsers } = useServer();

  const isSelected = selectedUser === user.id;

  const userClick = () => {
    setSelectedUser(user.id);
    if (pathname !== "/") router.push("/");
  };

  useEffect(() => {
    if (!user || !senderUser) return;
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch Last Message
      const lastMsgQuery = await LastMessage({
        senderId: senderUser.id,
        receiverId: user.id,
      });
      if (lastMsgQuery.success && lastMsgQuery.data && typeof lastMsgQuery.data !== "string") {
        setLastMsg(lastMsgQuery.data as Message);
      }

      // Fetch Unread Count
      const unreadQuery = await countUnreadMessages({
        senderId: user.id,
        receiverId: senderUser.id,
      });
      if (unreadQuery.success) {
        setUnreadCount(unreadQuery.count || 0);
      }

      setLoading(false);
    };
    fetchData();
    
    // Refresh for non-socket updates
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [user, senderUser]);

  const isOnline = onlineUsers ? isUserOnline(user.id, onlineUsers) : false;

  return (
    <div
      onClick={userClick}
      className={`group relative flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer transition-all duration-500 active:scale-[0.98] mb-1.5 ${
        isSelected 
          ? "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100" 
          : "hover:bg-slate-50 border border-transparent"
      }`}
    >
      <div className="relative flex-shrink-0">
        <div className={`w-12 h-12 rounded-2xl overflow-hidden ring-2 transition-all duration-500 shadow-sm ${
          isSelected ? "ring-sky-200" : "ring-transparent group-hover:ring-slate-100"
        }`}>
          <Image
            width={48}
            height={48}
            alt={user.name}
            src={user.image || "/profile.png"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        {user.isFriend !== false && (
          <div
            className={`absolute w-3.5 h-3.5 rounded-full border-2 border-white -right-0.5 -bottom-0.5 transition-colors duration-300 shadow-sm ${
              isOnline ? "bg-emerald-500" : "bg-slate-300"
            }`}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <h4 className={`text-[15px] font-bold truncate transition-colors ${
            isSelected ? "text-sky-900" : "text-slate-800"
          }`}>
            {user.name}
          </h4>
          {lastMsg && (
            <span className={`text-[10px] font-black transition-colors uppercase tracking-widest ${
               isSelected ? "text-sky-600/70" : "text-slate-400"
            }`}>
               {formatDateAsAMPM({ date: lastMsg.createdAt })}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-1.5">
          {loading && !lastMsg ? (
            <div className="h-3 w-16 bg-slate-100/50 rounded animate-pulse" />
          ) : (
            <div className="flex flex-1 items-center justify-between min-w-0">
               <p className={`text-[13px] font-medium truncate flex-1 transition-colors ${
                 isSelected ? "text-sky-700/80" : "text-slate-500"
               }`}>
                 {lastMsg ? (
                   <>
                     {lastMsg.senderId === senderUser?.id && (
                       <span className="opacity-70 font-black mr-1 uppercase text-[10px]">You:</span>
                     )}
                     {lastMsg.type === "image" ? (
                       <span className="italic flex items-center gap-1">📷 Photo</span>
                     ) : (
                       lastMsg.text
                     )}
                   </>
                 ) : (
                   <span className="opacity-40 italic text-[11px]">No messages yet</span>
                 )}
               </p>
               
               {unreadCount > 0 && !isSelected && (
                 <div className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-sky-600 px-1.5 text-[10px] font-black text-white shadow-lg shadow-sky-900/20 animate-in zoom-in duration-300">
                    {unreadCount}
                 </div>
               )}

               {user.isFriend === false && (
                 <span className="ml-2 text-[9px] font-black uppercase tracking-tighter text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-100/50">
                    Unfriended
                 </span>
               )}
            </div>
          )}
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-sky-600 rounded-l-full shadow-[0_0_15px_rgba(2,132,199,0.3)] animate-in slide-in-from-right-2 duration-300" />
      )}
    </div>
  );
};

export default SidebarUserCard;
