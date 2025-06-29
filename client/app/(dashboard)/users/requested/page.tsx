import { Users } from "lucide-react";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="grid grid-cols-4 mt-4 gap-4">
      <div className="bg-white rounded-lg p-4">
        <div className="w-max bg-orange-100 text-orange-400 text-xs px-2 py-0.5 rounded-full border border-orange-400">
          Pending
        </div>
        <div className="w-14 h-14 rounded-full overflow-hidden mt-4">
          <Image
            width={56}
            height={56}
            src="/assets/profile.png"
            alt="profile"
          />
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-neutral-800">
            Muhammad Bin Yasir
          </h2>
          <p className="text-neutral-500 text-xs">@MuhammadBinYasir</p>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Users className="w-4 h-4 text-neutral-600" />
            {/* {user.friends.length} Users */} 10 Users
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4">
        <div className="w-max bg-red-100 text-red-400 text-xs px-2 py-0.5 rounded-full border border-orange-400">
          Rejected
        </div>
        <div className="w-14 h-14 rounded-full overflow-hidden mt-4">
          <Image
            width={56}
            height={56}
            src="/assets/profile.png"
            alt="profile"
          />
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold text-neutral-800">
            Muhammad Bin Yasir
          </h2>
          <p className="text-neutral-500 text-xs">@MuhammadBinYasir</p>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Users className="w-4 h-4 text-neutral-600" />
            {/* {user.friends.length} Users */} 10 Users
          </div>
        </div>
        <div className="mt-4">
          <button className="text-sm w-full bg-sky-800 hover:bg-sky-900 text-white py-3 rounded-lg transition duration-300 cursor-pointer">
            Request Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
