import { SwatchBook, SwatchBookIcon } from "lucide-react";
import React from "react";

const SelectChatUser = () => {
  return <div className="w-full h-full flex items-center justify-center flex-col gap-4">
    {/* <img src="/assets/SelectUser.svg" className="w-md"/> */}
    <SwatchBook className="text-neutral-400 h-30 w-30"/>
    <div className="flex items-center flex-col gap-1">
        <h2 className="text-lg text-neutral-800 font-semibold">No User Found!</h2>
        <p className="text-base text-neutral-400 ">Please select a user to start a chat with..</p>
    </div>
  </div>;
};

export default SelectChatUser;
