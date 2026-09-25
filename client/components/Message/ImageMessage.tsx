import { formatDateAsAMPM } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";
import React from "react";

const ImageMessage = ({
  image,
  text,
  type,
  status,
  time,
  onload
}: {
  text?: string | null;
  type: "Send" | "Receive";
  image: string;
  status: string;
  time: Date;
  onload: () => void;
}) => {
  const isSender = type === "Send";

  return (
    <div className={`flex w-full mb-2 animate-in fade-in slide-in-from-bottom-2 duration-400 ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative flex flex-col max-w-[85%] md:max-w-[70%] lg:max-w-[50%] overflow-hidden rounded-2xl shadow-md transition-all duration-300 ${
          isSender ? "bg-sky-800 text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
        }`}
      >
        <div className="relative group overflow-hidden">
          <img 
            src={image} 
            alt="Message Attachment" 
            className="w-full max-h-[420px] object-cover transition-transform duration-500 group-hover:scale-105" 
            onLoad={onload} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm text-[10px] text-white font-medium">
            {formatDateAsAMPM({ date: time })}
          </div>
        </div>
        
        {text && (
          <div className="p-3">
            <p className="text-[14px] leading-relaxed mb-1">{text}</p>
            {isSender && (
              <div className="flex justify-end pr-2 h-0">
                <span className="relative -top-2 scale-75">
                  {status === "seen" ? (
                    <CheckCheck className="w-4 h-4 text-sky-300" strokeWidth={3} />
                  ) : (
                    <Check className="w-4 h-4 text-white/70" strokeWidth={3} />
                  )}
                </span>
              </div>
            )}
          </div>
        )}

        {!text && isSender && (
            <div className="absolute top-2 right-2 scale-75 drop-shadow-md">
                 {status === "seen" ? (
                    <CheckCheck className="w-5 h-5 text-sky-400" strokeWidth={3} />
                  ) : (
                    <Check className="w-5 h-5 text-white/90" strokeWidth={3} />
                  )}
            </div>
        )}
      </div>
    </div>
  );
};

export default ImageMessage;
