import { useUser } from "@/context/UserContext";
import { MessageCircle, UserPlus2Icon, Users2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Topbar = ({ className }: { className?: string }) => {
  const { user } = useUser();
  return (
    <div className={`flex gap-2 justify-between items-center border-b bg-white border-b-neutral-300 pb-6 ${className}`}>
      <Link href="/" className="flex items-center">
        <div className="w-8 h-8 flex bg-sky-800 text-white rounded-full items-center justify-center">
          <MessageCircle className="w-4 h-4" />
        </div>
        <div className=" ml-4">
          <h2 className="lg:text-base text-sm truncate text-neutral-800 font-semibold">
            ChatNow
          </h2>
          <p className="lg:text-[9px] text-[7px] text-neutral-500">
            Create With ❤️
          </p>
        </div>
      </Link>
      {user && (
        <div className=" flex items-center gap-1">
          <Link
            href="/users/requests"
            className="mr-4 flex items-center justify-center bg-neutral-100 relative lg:w-10 lg:h-10 w-8 h-8 rounded-full"
          >
            <UserPlus2Icon className="lg:w-5 lg:h-5 w-4 h-4" />
            <div className="shadow absolute top-0 left-[calc(100%-10px)] rounded-full py-0.5 px-2 lg:text-xs text-[8px] bg-sky-800 text-white">
              9+
            </div>
          </Link>

          <Link
            href="/users"
            className="flex items-center justify-center bg-neutral-100 relative  lg:w-10 lg:h-10 w-8 h-8 rounded-full"
          >
            <Users2 className="lg:w-5 lg:h-5 w-4 h-4" />
          </Link>
          <Link
            href="/edit"
            className="flex items-center justify-center bg-neutral-100 relative  lg:w-10 lg:h-10 w-8 h-8 rounded-full"
          >
            <Image
              width={32}
              height={32}
              src={user.image}
              alt="Profile Image"
              className="w-8 h-8 rounded-full"
            />

            <div className="absolute w-4 h-4 rounded-full bg-red-400 -right-1 bottom-0 border-4 border-white"></div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Topbar;
