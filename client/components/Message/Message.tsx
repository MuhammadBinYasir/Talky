import { Message as MessageType } from "@/lib/generated/prisma";
import { formatDateAsAMPM } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";
import React from "react";

const Message = ({ data, type }: { data: MessageType; type: string }) => {
  const isSender = type === "Send";

  return (
    <div
      data-message-id={data.id}
      className={`flex w-full mb-1 group animate-in fade-in slide-in-from-bottom-1 duration-300 ${isSender ? "justify-end" : "justify-start"}`}
    >
      <div className={`relative flex flex-col max-w-[80%] md:max-w-[70%] lg:max-w-[60%] ${isSender ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2.5 shadow-sm transition-all duration-300 ${
            isSender 
              ? "bg-sky-800 text-white rounded-2xl rounded-tr-none" 
              : "bg-white text-slate-800 rounded-2xl rounded-tl-none border border-slate-100"
          }`}
        >
          <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words">{data.text}</p>
          
          <div className={`flex items-center gap-1.5 mt-1 transition-opacity ${isSender ? "justify-end text-sky-100/60" : "text-slate-400"}`}>
            <span className="text-[10px] font-medium leading-none">
              {formatDateAsAMPM({ date: data.createdAt })}
            </span>
            {isSender && (
              <span className="flex items-center">
                {data.status === "seen" ? (
                  <CheckCheck className="w-3.5 h-3.5 text-sky-300" strokeWidth={3} />
                ) : (
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
