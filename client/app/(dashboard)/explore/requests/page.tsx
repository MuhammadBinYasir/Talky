"use client";
import {
  AcceptRejectRequest,
  friendsRequests,
  getCurrentUser,
  getData,
} from "@/actions/UserActions";
import { formatDateAsDMY } from "@/lib/utils";
import { Check, ChevronLeft, Plus, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type RequestType = {
  id: string;
  createdAt: Date;
  senderId: string;
  receiverId: string;
  status: string;
  sender: {
    name: string;
    supabaseId: string;
    id: string;
    email: string;
    image: string;
    bio: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

const Page = () => {
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const supabase = await getData();
      if (!supabase?.userId) return;

      const currentUser = await getCurrentUser({ supabaseId: supabase.userId });
      if (!currentUser?.userId) return;

      const res = await friendsRequests({ userId: currentUser.userId });
      if (res.success && res.data) {
        setRequests(res.data);
      }
    } catch (error) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const requestResponse = async ({ id, type }: { id: string; type: string }) => {
    const res = await AcceptRejectRequest({ id, type });
    if (res.success) {
      toast.success(`Request ${type}`);
      fetchData(); // Refresh list
    } else {
      toast.error("Action failed");
    }
  };

  return (
    <div className="p-8 lg:p-12 min-h-screen bg-slate-50/10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
               <Link href="/" className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-sky-600 shadow-sm border border-transparent hover:border-slate-100">
                  <ChevronLeft className="w-5 h-5" />
               </Link>
               <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] border-l-4 border-sky-400 pl-4 py-1">
                 Manage your incoming connection requests
               </p>
            </div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-4">
              Friend Requests
              {requests.length > 0 && (
                <span className="bg-sky-600 text-white text-[11px] uppercase font-black px-4 py-1.5 rounded-full shadow-lg shadow-sky-900/20">
                  {requests.length} New
                </span>
              )}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="h-24 w-full bg-white rounded-[24px] border border-slate-100 animate-pulse" />
             ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white/50 backdrop-blur-sm border border-dashed border-slate-200 rounded-[40px] p-24 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-8 ring-8 ring-slate-100/30 rotate-3">
              <User className="w-12 h-12 text-slate-300 -rotate-3" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">No pending requests</h3>
            <p className="text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">
              When people want to connect with you, their requests will appear here beautifully. 
              <Link href="/explore" className="text-sky-600 hover:underline block mt-2">Discover people</Link>
            </p>
          </div>
        ) : (
          <div className="grid gap-5 animate-in slide-in-from-bottom-5 duration-700">
            {requests.map((request, index) => {
              const sender = request.sender;
              return (
                <div
                  key={index}
                  className="group bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-sky-900/5 hover:border-sky-100 transition-all duration-500 flex items-center gap-8"
                >
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-[28px] overflow-hidden shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-500 ring-4 ring-white">
                      <Image
                        width={80}
                        height={80}
                        src={sender.image || "/profile.png"}
                        alt={sender.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-2">
                      <h2 className="text-xl font-black text-slate-800 truncate">
                        {sender.name}
                      </h2>
                      <span className="text-[10px] font-bold bg-slate-50 text-slate-400 px-3 py-1 rounded-lg uppercase tracking-tight">
                        Received {formatDateAsDMY({ date: request.createdAt })}
                      </span>
                    </div>
                    <p className="text-[14px] text-slate-400 font-medium truncate italic max-w-md">
                      {sender.bio || `Hey! I'm ${sender.name}. Let's connect on Talky!`}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pr-2">
                    <button
                      onClick={() => requestResponse({ id: request.id, type: "accepted" })}
                      className="h-12 px-8 bg-sky-800 text-white text-[13px] font-black uppercase tracking-[0.1em] rounded-2xl hover:bg-sky-900 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-sky-900/10 flex items-center gap-2.5"
                    >
                      <Check className="w-5 h-5" /> Accept
                    </button>
                    <button
                      onClick={() => requestResponse({ id: request.id, type: "rejected" })}
                      className="h-12 px-8 bg-slate-50 text-slate-400 hover:text-rose-600 text-[13px] font-black uppercase tracking-[0.1em] rounded-2xl hover:bg-rose-50 transition-all active:scale-95 flex items-center gap-2.5"
                    >
                      <Plus className="w-5 h-5 rotate-45" /> Decline
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
