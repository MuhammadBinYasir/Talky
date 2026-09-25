import React from "react";
import AvailableUsers from "@/components/AvailableUsers/AvailableUsers";
import AvailableUserLoading from "@/components/AvailableUsers/AvailableUsersLoading";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="p-8 lg:p-12 min-h-screen bg-slate-50/10">
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
             <Link href="/" className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-sky-600 shadow-sm border border-transparent hover:border-slate-100">
                <ChevronLeft className="w-5 h-5" />
             </Link>
             <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] border-l-4 border-sky-400 pl-4 py-1">
               Expand your social network on Talky
             </p>
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">
            Discover People
          </h2>
        </div>

        <React.Suspense fallback={<AvailableUserLoading />}>
          <AvailableUsers />
        </React.Suspense>
      </div>
    </div>
  );
};

export default Page;
