import AvailableUsers from "@/components/AvailableUsers/AvailableUsers";
import AvailableUserLoading from "@/components/AvailableUsers/AvailableUsersLoading";
import React from "react";

const page = () => {
  return (
    <>
      <h2 className="text-xl font-semibold text-neutral-800">
        Available Users
      </h2>

      <React.Suspense fallback={<AvailableUserLoading />}>
        <AvailableUsers />
      </React.Suspense>

      {/* <div className="w-full p-2 space-y-4 mt-4">
        <div className="w-full flex items-center py-4 px-6 bg-white rounded-lg">
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
                Testing Users
              </h2>
              <h2 className="text-sm text-neutral-600 truncate">
                @TestingUser
              </h2>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs bg-yellow-50 rounded-full pl-2 pr-4 py-[2px] w-max text-yellow-800 flex items-center gap-2">
                <Calendar className="text-yellow-800 w-3 h-3" /> 1 June, 2025
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
            <button className="px-4 py-2 bg-sky-800 border-none outline-none text-white text-sm rounded-full cursor-pointer flex items-center gap-2">
              <Check className="w-4 h-4" /> Accept
            </button>
            <button className="px-4 py-2 bg-sky-100 border-none outline-none text-sky-800 text-sm rounded-full cursor-pointer flex items-center gap-2">
              <Plus className="w-4 h-4 rotate-45" /> Decline
            </button>
          </div>
        </div>
        <div className="w-full flex items-center py-4 px-6 bg-white rounded-lg">
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
                Testing Users
              </h2>
              <h2 className="text-sm text-neutral-600 truncate">
                @TestingUser
              </h2>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs bg-yellow-50 rounded-full pl-2 pr-4 py-[2px] w-max text-yellow-800 flex items-center gap-2">
                <Calendar className="text-yellow-800 w-3 h-3" /> 1 June, 2025
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
            <button className="px-4 py-2 bg-sky-800 border-none outline-none text-white text-sm rounded-full cursor-pointer flex items-center gap-2">
              <Check className="w-4 h-4" /> Accept
            </button>
            <button className="px-4 py-2 bg-sky-100 border-none outline-none text-sky-800 text-sm rounded-full cursor-pointer flex items-center gap-2">
              <Plus className="w-4 h-4 rotate-45" /> Decline
            </button>
          </div>
        </div>
        <div className="w-full flex items-center py-4 px-6 bg-white rounded-lg">
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
                Testing Users
              </h2>
              <h2 className="text-sm text-neutral-600 truncate">
                @TestingUser
              </h2>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs bg-yellow-50 rounded-full pl-2 pr-4 py-[2px] w-max text-yellow-800 flex items-center gap-2">
                <Calendar className="text-yellow-800 w-3 h-3" /> 1 June, 2025
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
            <button className="px-4 py-2 bg-sky-800 border-none outline-none text-white text-sm rounded-full cursor-pointer flex items-center gap-2">
              <Check className="w-4 h-4" /> Accept
            </button>
            <button className="px-4 py-2 bg-sky-100 border-none outline-none text-sky-800 text-sm rounded-full cursor-pointer flex items-center gap-2">
              <Plus className="w-4 h-4 rotate-45" /> Decline
            </button>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default page;
