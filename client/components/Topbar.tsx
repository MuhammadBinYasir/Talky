"use client";
import { countPendingRequests } from "@/actions/UserActions";
import { useUser } from "@/context/UserContext";
import { Compass, MessageCircle, UserPlus2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Topbar = ({ className }: { className?: string }) => {
  const { user } = useUser();
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchCount = async () => {
      const res = await countPendingRequests({ userId: user.id });
      if (res.success) setRequestCount(res.count);
    };
    fetchCount();
    
    // Refresh count every 30 seconds for non-socket updates
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className={`flex items-center justify-between pb-6 border-b border-slate-100/60 transition-all duration-300 ${className}`}>
      <Link href="/" className="flex items-center group">
        <div className="w-11 h-11 flex bg-gradient-to-br from-sky-600 to-sky-800 text-white rounded-2xl items-center justify-center shadow-xl shadow-sky-900/15 transform transition-all group-hover:scale-105 group-active:scale-95 duration-500">
          <MessageCircle className="w-6 h-6 animate-in zoom-in-50 duration-500" />
        </div>
        <div className="ml-3.5 transition-all">
          <h2 className="text-[19px] tracking-tight text-slate-800 font-extrabold leading-none mb-1.5 group-hover:text-sky-900 transition-colors">
            Talky<span className="text-sky-600/50">.</span>
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10 animate-pulse shadow-sm shadow-emerald-500/20" />
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-nowrap">Active System</span>
          </div>
        </div>
      </Link>

      {user && (
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <Link
            href="/users"
            title="Discover People"
            className="flex items-center justify-center bg-white hover:bg-slate-50 text-slate-400 hover:text-sky-600 border border-slate-100 shadow-sm transition-all duration-300 relative w-11 h-11 rounded-2xl group/link"
          >
            <Compass className="w-5.5 h-5.5 transition-transform group-hover/link:rotate-90 duration-700" />
          </Link>

          <Link
            href="/users/requests"
            title="Friend Requests"
            className="flex items-center justify-center bg-white hover:bg-slate-50 text-slate-400 hover:text-sky-600 border border-slate-100 shadow-sm transition-all duration-300 relative w-11 h-11 rounded-2xl group/link"
          >
            <UserPlus2Icon className="w-5.5 h-5.5 transition-transform group-hover/link:-rotate-12" />
            {requestCount > 0 && (
              <div className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-black text-white ring-4 ring-white shadow-lg shadow-rose-900/10 animate-in zoom-in duration-300">
                {requestCount}
              </div>
            )}
          </Link>

          <Link
            href="/edit"
            className="group/p relative flex items-center justify-center w-11 h-11 rounded-2xl overflow-hidden ring-1 ring-slate-100 hover:ring-sky-600/30 shadow-sm transition-all duration-500"
          >
            <Image
              width={44}
              height={44}
              src={user.image || "/profile.png"}
              alt="Profile"
              className="w-full h-full object-cover transition-transform group-hover/p:scale-110 duration-700"
            />
            <div className="absolute inset-0 bg-sky-900/0 group-hover/p:bg-sky-900/5 transition-colors" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Topbar;
