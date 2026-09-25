import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-8">
      {/* <div className="p-2 gap-2 items-center justify-center w-xl bg-white h-12 rounded-md mx-auto my-6 grid grid-cols-3">
        <div className="cursor-pointer flex items-center justify-center bg-neutral-100 rounded-md h-full">
          All Users
        </div>
        <div className="cursor-pointer flex items-center justify-center">
          Requested Users
        </div>
        <div className="cursor-pointer flex items-center justify-center">
          User Requests
        </div>
      </div> */}
      {children}
    </div>
  );
};

export default layout;
