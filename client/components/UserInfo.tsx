import { Users } from "lucide-react";
import Image from "next/image";
import React from "react";

const UserInfo = () => {
  return (
    <div className="p-8">
      <div className="w-20 h-20 rounded-full overflow-hidden">
        <Image width={80} height={80} src="/assets/profile.png" alt="profile" />
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-neutral-800">
          Muhammad Bin Yasir
        </h2>
        <p className="text-neutral-500 text-xs">@MuhammadBinYasir</p>
        <p className="text-neutral-600 text-xs mt-2">Updated Successfully</p>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold truncate">Media</h2>
        <div className="grid grid-cols-3 gap-4 mt-2">
          <Image
            src="/assets/img1.png"
            className="w-full object-cover h-auto aspect-square overflow-hidden rounded-md"
            width={200}
            height={200}
            alt=""
          />
          <Image
            src="/assets/img2.jpg"
            className="w-full object-cover h-auto aspect-square overflow-hidden rounded-md"
            width={200}
            height={200}
            alt=""
          />
          <Image
            src="/assets/wallpaper.png"
            className="w-full object-cover h-auto aspect-square overflow-hidden rounded-md"
            width={200}
            height={200}
            alt=""
          />
          <Image
            src="/assets/profile.png"
            className="w-full object-cover h-auto aspect-square overflow-hidden rounded-md"
            width={200}
            height={200}
            alt=""
          />
          <Image
            src="/assets/img1.png"
            className="w-full object-cover h-auto aspect-square overflow-hidden rounded-md"
            width={200}
            height={200}
            alt=""
          />
          <Image
            src="/assets/profile.png"
            className="w-full object-cover h-auto aspect-square overflow-hidden rounded-md"
            width={200}
            height={200}
            alt=""
          />

          <button className="w-full h-10 bg-neutral-100 text-neutral-600 text-sm rounded-full cursor-pointer">
            See More
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
