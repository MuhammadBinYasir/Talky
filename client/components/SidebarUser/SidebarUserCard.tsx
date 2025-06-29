"use client";
import { useMessage } from "@/context/MessageContext";
import { useServer } from "@/context/ServerContext";
import { isUserOnline } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const SidebarUserCard = ({
  user,
}: {
  user: {
    name: string;
    email: string;
    image: string;
    id: string;
    createdAt: Date;
    supabaseId: string;
    bio: string;
    updatedAt: Date;
  };
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedUser, setSelectedUser } = useMessage();
  const userClick = () => {
    setSelectedUser(user.id);

    if (pathname !== "/") {
      router.push("/");
    }
  };
  const { onlineUsers } = useServer();
  if (!onlineUsers) return <p>Loading....</p>;
  const isOnline = isUserOnline(user.id, onlineUsers);
  return (
    <div
      onClick={() => userClick()}
      className={`${
        selectedUser === user.id && "bg-gray-100"
      } flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition cursor-pointer`}
    >
      <div className="w-10 h-10 rounded-full object-cover border relative">
        <Image
          width={40}
          height={40}
          alt=""
          src="/assets/profile.png"
          className="w-full h-full rounded-full"
        />
        <div
          className={`absolute w-4 h-4 rounded-full ${
            isOnline ? "bg-green-400" : "bg-red-400"
          } -right-1 bottom-0 border-4 border-white`}
        ></div>
      </div>
      <div className="flex-1">
        <h4 className="text-sm text-neutral-800 font-semibold flex w-full items-center justify-between truncate">
          {user.name}
          {/* <div className="text-[9px] w-max px-2 py-1 rounded-full bg-sky-700 text-white">
                  1 unread
                </div> */}
        </h4>
        <p className="text-xs text-neutral-400">You: Great Job 👍</p>
      </div>
    </div>
  );
};

export default SidebarUserCard;
