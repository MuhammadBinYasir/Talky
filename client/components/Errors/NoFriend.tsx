import { User, UserX, UserX2 } from "lucide-react";
import React from "react";

const NoFriend = () => {
  return (
    <div className="w-full h-full">
      <div className="bg-sky-50 rounded-md w-full p-6">
        <UserX2 className="w-6 h-6 text-sky-600" />
        <h2 className="font-semibold text-sky-900 mt-4">No User Found</h2>
        <p className="text-sky-600 text-xs mt-1">
          No Friends Found. Send a Friend Request to users and start chatting
          with them now with ease.
        </p>
      </div>
    </div>
  );
};

export default NoFriend;
