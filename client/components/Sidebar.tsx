import React from "react";
import SidebarUser from "./SidebarUser/SidebarUser";

const Sidebar = () => {
  return (
    <>
      <div className="mt-4 space-y-2">
        {/* <div className="flex items-center gap-3 px-2 py-3 cursor-pointer">
         
          <div className="relative w-10 h-8">
            <div className="absolute left-0 z-30 w-6 h-6">
              <Image
                width={24}
                height={24}
                alt=""
                src="/assets/profile.png"
                className="w-full h-full rounded-full border-2 border-white"
              />
            </div>
            <div className="absolute left-3 top-2 z-20 w-6 h-6">
              <Image
                width={24}
                height={24}
                alt=""
                src="/assets/profile.png"
                className="w-full h-full rounded-full border-2 border-white"
              />
            </div>
            <div className="absolute left-3 bottom-4 z-10 w-6 h-6">
              <Image
                width={24}
                height={24}
                alt=""
                src="/assets/profile.png"
                className="w-full h-full rounded-full border-2 border-white"
              />
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-sm text-neutral-800 font-semibold flex w-full items-center justify-between">
              Family ❤️
              <div className="text-[9px] w-max px-2 py-1 rounded-full bg-sky-700 text-white">
                1 unread
              </div>
            </h4>
            <p className="text-xs text-neutral-400">
              Hamza: Hy There Everyone!!
            </p>
          </div>
        </div> */}

        <SidebarUser />
        {/* <React.Suspense fallback={<SidebarUserLoading />}>
        </React.Suspense> */}
      </div>
    </>
  );
};

export default Sidebar;
