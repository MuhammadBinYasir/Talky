"use client";
import React from "react";
import { useMessage } from "@/context/MessageContext";
import { 
  LogOut, 
  MailCheck, 
  MessageCircle, 
  SearchIcon, 
  Settings, 
  UserPlus2Icon, 
  Users2 
} from "lucide-react";
import Link from "next/link";
import SidebarUser from "./SidebarUser/SidebarUser";
import { useUser } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { countPendingRequests, getCurrentUser, getData, logOut } from "@/actions/UserActions";
import toast from "react-hot-toast";

const ResponsiveSidebar = ({ children }: { children: React.ReactNode }) => {
  const { selectedUser } = useMessage();
  const { user: authUser } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [requestCount, setRequestCount] = React.useState(0);

  React.useEffect(() => {
    const fetchCount = async () => {
      const auth = await getData();
      if (!auth?.userId) return;

      const currentUser = await getCurrentUser({ supabaseId: auth.userId });
      if (!currentUser?.userId) return;

      const res = await countPendingRequests({ userId: currentUser.userId });
      if (res.success) setRequestCount(res.count || 0);
    };
    fetchCount();
  }, [pathname]);

  const handleLogout = async () => {
    const res = await logOut();
    if (res.success) {
      toast.success("Logged out successfully");
      router.push("/login");
    }
  };

  return (
    <div className="grid grid-cols-4 h-[100dvh] overflow-hidden bg-white">
      {/* 🟢 SIDEBAR SECTION */}
      <div
        className={`lg:block lg:col-span-1 col-span-4 p-6 border-r border-slate-200 h-full overflow-y-auto custom-scrollbar shadow-[inset_-1px_0_0_0_rgba(0,0,0,0.02)] ${
          selectedUser ? "lg:block hidden" : "block"
        } ${pathname !== "/" ? "lg:block hidden" : "block"}`}
      >
        {/* Header with App Logo & Logout */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center shadow-lg shadow-sky-900/20">
               <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Talky</h1>
          </div>
          <button 
            onClick={handleLogout} 
            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-95"
            title="Sign Out"
          >
             <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Grid (All URLs) */}
        <div className="grid grid-cols-5 gap-1.5 mb-8 bg-slate-50/50 p-1 rounded-2xl border border-slate-100">
           <Link 
            href="/" 
            className={`p-2.5 rounded-xl transition-all flex justify-center group ${pathname === "/" ? "bg-white text-sky-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-400 hover:bg-white hover:text-sky-600"}`}
           >
              <MessageCircle className="w-5.5 h-5.5 transition-transform group-hover:scale-110" />
           </Link>
           <Link 
            href="/explore" 
            className={`p-2.5 rounded-xl transition-all flex justify-center group ${pathname === "/explore" ? "bg-white text-sky-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-400 hover:bg-white hover:text-sky-600"}`}
           >
              <Users2 className="w-5.5 h-5.5 transition-transform group-hover:scale-110" />
           </Link>
           <Link 
            href="/explore/requests" 
            className={`p-2.5 rounded-xl transition-all flex justify-center group relative ${pathname === "/explore/requests" ? "bg-white text-sky-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-400 hover:bg-white hover:text-sky-600"}`}
           >
              <UserPlus2Icon className="w-5.5 h-5.5 transition-transform group-hover:scale-110" />
              {requestCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-sky-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-in zoom-in duration-300">
                  {requestCount}
                </span>
              )}
           </Link>
           <Link 
            href="/explore/requested" 
            className={`p-2.5 rounded-xl transition-all flex justify-center group ${pathname === "/explore/requested" ? "bg-white text-sky-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-400 hover:bg-white hover:text-sky-600"}`}
           >
              <MailCheck className="w-5.5 h-5.5 transition-transform group-hover:scale-110" />
           </Link>
           <Link 
            href="/edit" 
            className={`p-2.5 rounded-xl transition-all flex justify-center group ${pathname === "/edit" ? "bg-white text-sky-600 shadow-sm ring-1 ring-slate-200/50" : "text-slate-400 hover:bg-white hover:text-sky-600"}`}
           >
              <Settings className="w-5.5 h-5.5 transition-transform group-hover:scale-110" />
           </Link>
        </div>

        {/* Search Bar */}
        <div className="relative group mb-8">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-600 transition-colors">
            <SearchIcon className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-11 pr-4 py-3 text-[14px] rounded-2xl bg-white border border-slate-200 outline-none focus:border-sky-500/30 focus:ring-4 focus:ring-sky-500/5 transition-all placeholder:text-slate-400 shadow-sm"
          />
        </div>

        {/* Recent Chats List */}
        <div className="space-y-1 flex flex-col h-full">
          <div className="px-2 mb-3 flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Conversations</h3>
            {authUser && (
              <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100 animate-pulse">
                Online
              </span>
            )}
          </div>
          <SidebarUser />
        </div>
      </div>
      
      {/* 🔴 MAIN CONTENT SECTION */}
      <main className={`col-span-4 lg:col-span-3 h-full relative ${
        selectedUser || pathname !== "/" ? "block" : "lg:block hidden"
      }`}>
        {children}
      </main>
    </div>
  );
};

export default ResponsiveSidebar;
