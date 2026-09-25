"use client";
import {
  getCurrentUser,
  getData,
  sentRequests,
} from "@/actions/UserActions";
import { formatDateAsDMY } from "@/lib/utils";
import { ChevronLeft, Clock, Loader2, Mail, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type SentRequestType = {
  id: string;
  createdAt: Date;
  senderId: string;
  receiverId: string;
  status: string;
  receiver: {
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
  const [requests, setRequests] = useState<SentRequestType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const auth = await getData();
      if (!auth?.userId) return;

      const currentUser = await getCurrentUser({ supabaseId: auth.userId });
      if (!currentUser?.userId) return;

      const res = await sentRequests({ userId: currentUser.userId });
      if (res.success && res.data) {
        setRequests(res.data);
      }
    } catch (error) {
      toast.error("Failed to load sent requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8 lg:p-12 min-h-screen bg-slate-50/10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
             <Link href="/" className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-sky-600 shadow-sm border border-transparent hover:border-slate-100">
                <ChevronLeft className="w-5 h-5" />
             </Link>
             <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] border-l-4 border-sky-400 pl-4 py-1">
               Overview of your outgoing connection attempts
             </p>
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight flex items-center justify-between">
            Sent Requests
            <span className="text-[14px] text-slate-400 font-bold uppercase tracking-widest">{requests.length} Overall</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
             <Loader2 className="w-10 h-10 text-sky-600 animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white/50 backdrop-blur-sm border border-dashed border-slate-200 rounded-[40px] p-24 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-8 ring-8 ring-slate-100/30 rotate-3">
              <Mail className="w-12 h-12 text-slate-300 -rotate-3" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">No sent requests</h3>
            <p className="text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">
              You haven&apos;t sent any connection requests recently. Go explore and meet new people! 
              <Link href="/explore" className="text-sky-600 hover:underline block mt-2">Discover people</Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-5 duration-700">
            {requests.map((request, index) => {
              const receiver = request.receiver;
              const isPending = request.status === "pending";
              const isRejected = request.status === "rejected";
              
              return (
                <div key={index} className="group bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-sky-900/10 transition-all duration-500 overflow-hidden relative">
                  {/* Status Overlay */}
                  <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    isPending ? "bg-amber-100 text-amber-600" : isRejected ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                  }`}>
                    {request.status}
                  </div>

                  <div className="flex flex-col items-start gap-4">
                    <div className="w-20 h-20 rounded-[28px] overflow-hidden shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 ring-4 ring-slate-50">
                      <Image
                        width={80}
                        height={80}
                        src={receiver.image || "/profile.png"}
                        alt={receiver.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <h2 className="text-xl font-black text-slate-800 truncate tracking-tight">{receiver.name}</h2>
                      <p className="text-[12px] text-slate-400 font-bold uppercase tracking-tight">@{receiver.email.split('@')[0]}</p>
                    </div>

                    <div className="w-full h-px bg-slate-50 my-2" />

                    <div className="flex items-center justify-between w-full">
                       <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" /> Sent {formatDateAsDMY({ date: request.createdAt })}
                       </div>
                    </div>
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
