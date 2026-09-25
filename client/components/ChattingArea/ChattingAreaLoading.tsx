import React from "react";

const ChattingAreaLoading = () => {
  return (
    <div className="w-full h-full flex flex-col gap-5 p-5 flex-1 bg-slate-50/10">
      <div className={`flex justify-end`}>
        <div
          className={`bg-white p-4 rounded-xl w-xs shadow-sm flex flex-col gap-2`}
        >
          <div className="w-full h-3 bg-neutral-100 rounded-full"></div>
          <div className="w-full h-3 bg-neutral-100 rounded-full"></div>
          <div className="w-full h-3 bg-neutral-100 rounded-full"></div>
        </div>
      </div>
      <div className={`flex justify-start`}>
        <div
          className={`bg-white p-4 rounded-xl w-xs shadow-sm flex flex-col gap-2`}
        >
          <div className="w-full h-3 bg-neutral-100 rounded-full"></div>
          <div className="w-full h-3 bg-neutral-100 rounded-full"></div>
          <div className="w-1/2 h-3 bg-neutral-100 rounded-full"></div>
        </div>
      </div>
      <div className={`flex justify-end`}>
        <div
          className={`bg-white p-4 rounded-xl w-xs shadow-sm flex flex-col gap-2`}
        >
          <div className="w-full h-3 bg-neutral-100 rounded-full"></div>
          <div className="w-full h-3 bg-neutral-100 rounded-full"></div>
          <div className="w-full h-3 bg-neutral-100 rounded-full"></div>
          <div className="w-full h-3 bg-neutral-100 rounded-full"></div>
          <div className="w-3/4 h-3 bg-neutral-100 rounded-full"></div>
        </div>
      </div>
      <div className={`flex justify-end`}>
        <div
          className={`bg-white p-4 rounded-xl w-xs shadow-sm flex flex-col gap-2`}
        >
          <div className="w-full h-3 bg-neutral-100 rounded-full"></div>
          <div className="w-1/2 h-3 bg-neutral-100 rounded-full"></div>
        </div>
      </div>
      <div className={`flex justify-start`}>
        <div
          className={`bg-white p-4 rounded-xl w-xs shadow-sm flex flex-col gap-2`}
        >
          <div className="w-full h-3 bg-neutral-100 rounded-full"></div>
          <div className="w-full h-3 bg-neutral-100 rounded-full"></div>
          <div className="w-full h-3 bg-neutral-100 rounded-full"></div>
          <div className="w-1/4 h-3 bg-neutral-100 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ChattingAreaLoading;
