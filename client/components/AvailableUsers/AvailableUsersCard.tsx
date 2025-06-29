"use client";
import {
  getCurrentUser,
  getData,
  sendChatRequest,
} from "@/actions/UserActions";
import { Users } from "lucide-react";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";

const AvailableUsersCard = ({
  user,
}: {
  user: {
    name: string;
    email: string;
    id: string;
    image: string;
    supabaseId: string;
    bio: string;
    createdAt: Date;
    updatedAt: Date;
  };
}) => {
  const sendRequest = async ({ oppUserId }: { oppUserId: string }) => {
    try {
      const getSupabaseUser = await getData();

      if (!getSupabaseUser?.userId) {
        toast.error("No Supabase user found");
        return;
      }

      const supabaseId = getSupabaseUser.userId;

      const getMongoUser = await getCurrentUser({ supabaseId });

      if (!getMongoUser?.userId) {
        toast.error(getMongoUser.message);
        return;
      }

      const result = await sendChatRequest({
        userId: getMongoUser.userId,
        oppUserId,
      });

      if (result.success) {
        toast.success(`${result.message}`);
      } else {
        toast.error(`${result.message}`);
      }
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error("An unexpected error occurred");
    }
  };
  return (
    <div className="bg-white rounded-lg p-4">
      <div className="w-14 h-14 rounded-full overflow-hidden">
        <Image width={56} height={56} src="/assets/profile.png" alt="profile" />
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-neutral-800">{user.name}</h2>
        <p className="text-neutral-500 text-xs">@{user.email}</p>
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Users className="w-4 h-4 text-neutral-600" />
          {/* {user.friends.length} Users */} 10 Users
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={() =>
            sendRequest({
              oppUserId: user.id,
            })
          }
          className="text-sm w-full bg-sky-800 hover:bg-sky-900 text-white py-3 rounded-lg transition duration-300 cursor-pointer"
        >
          Send Chat Request
        </button>
      </div>
    </div>
  );
};

export default AvailableUsersCard;
