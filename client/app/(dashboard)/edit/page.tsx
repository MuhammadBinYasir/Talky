"use client";
import EditProfile from "@/components/EditProfile";
import { useUser } from "@/context/UserContext";
import React from "react";

const Page = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="p-8 lg:p-12 min-h-screen bg-slate-50/10">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-pulse">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-2xl bg-slate-100 shadow-inner" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-48 bg-slate-100 rounded-full" />
              <div className="h-4 w-32 bg-slate-50 rounded-full" />
            </div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 bg-slate-100 rounded-full" />
                <div className="h-12 w-full bg-slate-50 rounded-xl" />
              </div>
            ))}
            <div className="h-12 w-full bg-slate-200 rounded-2xl mt-8" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 min-h-screen bg-slate-50/10">
      <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
            My Profile
          </h2>
          <p className="text-slate-500 font-medium tracking-wide border-l-4 border-sky-600 pl-4 py-1">
            Customize how you appear to others on Talky.
          </p>
        </div>

        <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-slate-100 shadow-xl shadow-sky-900/5">
          <EditProfile data={{ user }} />
        </div>
      </div>
    </div>
  );
};

export default Page;
