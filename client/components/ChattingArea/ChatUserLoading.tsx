import { ChevronLeft } from "lucide-react";
import React from "react";

const ChatUserLoading = () => {
  return (
    <div className="w-full min-h-20 bg-white border-b border-b-neutral-200 flex items-center justify-between gap-3 px-4 overflow-hidden">
      <div className="flex items-center gap-3">
        <ChevronLeft className="w-6 h-6 text-neutral-100" />
        <div className="w-10 h-10 rounded-full bg-neutral-100"></div>
        <div className="space-y-0.5">
          <h4 className="h-4 w-lg max-w-full bg-neutral-100 rounded-full"></h4>
          <div className="flex gap-2">
            <div className="h-4 bg-neutral-100 w-22 rounded-full"></div>
            <div className="h-4 bg-neutral-100 w-22 rounded-full"></div>
            <div className="h-4 bg-neutral-100 w-22 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="w-5 h-5 bg-neutral-100 rounded-full"></div>
    </div>
  );
};

export default ChatUserLoading;
