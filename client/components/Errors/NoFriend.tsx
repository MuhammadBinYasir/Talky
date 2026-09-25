import { UserPlus2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";

const NoFriend = () => {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-8 bg-white/50 rounded-[32px] border border-dashed border-slate-200 mt-4 animate-in fade-in zoom-in-95 duration-700">
      <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm shadow-sky-900/5 rotate-3">
        <UserPlus2Icon className="w-8 h-8 text-sky-600 -rotate-3" />
      </div>
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-[17px] font-black text-slate-800 tracking-tight leading-none">Your chat list is quiet</h2>
        <p className="text-[13px] text-slate-400 font-medium px-4">
          Discover new explorers and start a conversation!
        </p>
      </div>
      <Link 
        href="/users"
        className="px-6 py-2.5 bg-sky-800 hover:bg-sky-900 text-white text-[13px] font-bold rounded-xl transition-all shadow-lg shadow-sky-900/10 active:scale-95"
      >
        Discover People
      </Link>
    </div>
  );
};

export default NoFriend;
