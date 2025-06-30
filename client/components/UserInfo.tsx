"use client";
import { fetchImages } from "@/actions/MessageActions";
import { useMessage } from "@/context/MessageContext";
import { useUser } from "@/context/UserContext";
import { ChevronLeft, Users } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const UserInfo = ({
  data: { setViewInfo },
}: {
  data: {
    setViewInfo: (viewInfo: boolean) => void;
  };
}) => {
  const { user } = useUser();
  const { selectedUser } = useMessage();
  const [data, setData] = useState<string[]>([]);
  useEffect(() => {
    if (!user || !selectedUser) return;

    const getImages = async () => {
      const res = await fetchImages({
        senderId: user.id,
        receiverId: selectedUser,
      });

      if (res.success && res.data.length) {
        setData(res.data.filter((img): img is string => img !== null));
      }
    };

    getImages();
  }, [user, selectedUser]);

  if (!user) return <p>Loading...</p>;
  return (
    <div className="p-8">
      <ChevronLeft
        className="w-8 h-8 text-neutral-800 cursor-pointer"
        onClick={() => setViewInfo(false)}
      />
      <div className="w-20 h-20 rounded-full overflow-hidden mt-5">
        <Image width={80} height={80} src="/assets/profile.png" alt="profile" />
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-neutral-800">{user.name}</h2>
        <p className="text-neutral-500 text-xs">@{user.email}</p>
        <p className="text-neutral-600 text-xs mt-2">{user.bio}</p>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold truncate">Media</h2>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {data.slice(0, 6).map((item, index) => (
            <Image
              src={item}
              key={index}
              className="w-full object-cover h-auto aspect-square overflow-hidden rounded-md"
              width={200}
              height={200}
              alt=""
            />
          ))}
        </div>
        <button className="w-full h-10 bg-neutral-100 text-neutral-600 text-sm rounded-full cursor-pointer mt-4">
          See More
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
