"use client";
import {
  AcceptRejectRequest,
  friendsRequests,
  getCurrentUser,
  getData,
} from "@/actions/UserActions";
import { formatDateAsDMY } from "@/lib/utils";
import { Calendar, Check, MessageCircle, Plus, User } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type requests = {
  id: string;
  createdAt: Date;
  senderId: string;
  receiverId: string;
  status: string;
  sender: {
    name: string;
    supabaseId: string;
    id: string;
    email: string;
    image: string;
    bio: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

const page = () => {
  const [requests, setRequests] = useState<requests[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const supabase = await getData();

      if (!supabase?.userId) {
        toast.error("User Not Found!");
        return;
      }

      const supabaseId = supabase.userId;
      const CurrentUser = await getCurrentUser({ supabaseId });

      if (!CurrentUser?.userId) {
        toast.error("Current user not found in DB!");
        return;
      }

      const requests = await friendsRequests({
        userId: CurrentUser.userId,
      });

      if (!requests.success) {
        toast.error(`${requests.message}` || "Failed to fetch requests");
        return;
      }

      if (requests.data && requests.data.length > 0) {
        // safe to use
        setRequests(requests.data);
      } else {
        toast("No friend requests.");
      }

      // Or update state if using useState:
      // setRequests(requests.data);
    };

    fetchData();
  }, []);

  const requestResponse = async ({
    id,
    type,
  }: {
    id: string;
    type: string;
  }) => {
    const update = await AcceptRejectRequest({
      id,
      type,
    });
    if (update.success) {
      toast.success(`${update.message}`);
    } else {
      toast.error(`${update.message}`);
    }
  };
  return (
    <div className="w-full p-2 space-y-4 mt-4">
      {requests.map((request, index) => {
        const sender = request.sender;
        return (
          <div
            key={index}
            className="w-full flex items-center py-4 px-6 bg-white rounded-lg"
          >
            <Image
              width={46}
              height={46}
              src="/assets/profile.png"
              alt="Profile"
              className="rounded-full object-fill"
            />
            <div className="flex-1 ml-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg text-neutral-800 truncate font-semibold">
                  {sender.name}
                </h2>
                <h2 className="text-sm text-neutral-600 truncate">
                  @{sender.email}
                </h2>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs bg-yellow-50 rounded-full pl-2 pr-4 py-[2px] w-max text-yellow-800 flex items-center gap-2">
                  <Calendar className="text-yellow-800 w-3 h-3" />{" "}
                  {formatDateAsDMY({ date: request.createdAt })}
                </p>
                <p className="text-xs bg-sky-50 rounded-full pl-2 pr-4 py-[2px] w-max text-sky-700 flex items-center gap-2">
                  <User className="text-sky-800 w-3 h-3" /> 10 Users
                </p>
                <p className="text-xs bg-purple-50 rounded-full pl-2 pr-4 py-[2px] w-max text-purple-700 flex items-center gap-2">
                  <MessageCircle className="text-purple-800 w-3 h-3" /> 1028
                  Messages
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  requestResponse({
                    id: request.id,
                    type: "accepted",
                  })
                }
                className="px-4 py-2 bg-sky-800 border-none outline-none text-white text-sm rounded-full cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Accept
              </button>
              <button
                onClick={() =>
                  requestResponse({
                    id: request.id,
                    type: "rejected",
                  })
                }
                className="px-4 py-2 bg-sky-100 border-none outline-none text-sky-800 text-sm rounded-full cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4 rotate-45" /> Decline
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default page;
