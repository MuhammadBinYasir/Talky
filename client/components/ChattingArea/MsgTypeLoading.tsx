import React from "react";

const MsgTypeLoading = () => {
  return (
    <div className="w-full max-h-20 min-h-20 px-5 py-2">
      <div className="w-full h-[60px] bg-white rounded-full flex items-center px-4 gap-2">
        <div className="w-full h-[40px] bg-neutral-100 rounded-full"></div>
        <div className="w-11 aspect-square bg-neutral-100 rounded-full"></div>
        <div className="w-11 aspect-square bg-neutral-100 rounded-full"></div>
        <div className="w-11 aspect-square bg-neutral-100 rounded-full"></div>
        <div className="w-24 h-10 bg-neutral-100 rounded-full"></div>
      </div>
    </div>
  );
};

export default MsgTypeLoading;
