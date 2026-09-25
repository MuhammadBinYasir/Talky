import { MessageSquare } from "lucide-react";
import React from "react";

const SelectChatUser = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-50/50 backdrop-blur-sm">
      <div className="w-24 h-24 bg-white rounded-[32px] shadow-xl shadow-sky-900/5 flex items-center justify-center mb-8 rotate-3 animate-bounce-slow">
        <div className="w-16 h-16 bg-sky-50 rounded-[24px] flex items-center justify-center -rotate-3 transition-transform hover:scale-110 duration-500">
          <MessageSquare className="text-sky-600 h-8 w-8" />
        </div>
      </div>
      
      <div className="text-center space-y-2 max-w-xs transition-all duration-700">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Your messages</h2>
        <p className="text-[15px] text-slate-500 font-medium leading-relaxed">
          Select a conversation from the sidebar or find a new friend to start chatting.
        </p>
      </div>

      <div className="mt-12 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-sky-200 animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-sky-300 animate-pulse delay-75" />
        <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse delay-150" />
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(3deg); }
          50% { transform: translateY(-10px) rotate(4deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SelectChatUser;
