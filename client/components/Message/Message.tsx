import { formatDateAsAMPM } from "@/lib/utils";
import React from "react";

const Message = ({
  text,
  type,
  time,
  status
}: {
  text: string | null;
  type: "Send" | "Receive";
  time: Date;
  status?: string;
}) => {
  return (
    <>
      <div
        className={`flex ${type == "Send" ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`${
            type == "Send" ? "bg-sky-600 text-white" : "bg-white text-gray-800"
          } px-4 py-2 rounded-xl max-w-xs shadow-sm`}
        >
          <p className="text-sm">{text}</p>
          <span
            className={`text-[10px] text-right block mt-2 ${
              type == "Send" ? "text-white/70" : "text-gray-400"
            }`}
          >
            {formatDateAsAMPM({ date: time })} . {status}
          </span>
        </div>
      </div>
    </>
  );
};

export default Message;
