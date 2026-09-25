"use client";
import {
  getCurrentUser,
  getData,
  sendChatRequest,
} from "@/actions/UserActions";
import { User as UserIcon, Calendar, UserPlus, Sparkles, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

const AvailableUsersCard = ({
  user,
}: {
  user: {
    name: string;
    email: string;
    id: string;
    image: string;
    bio: string;
    createdAt: Date;
  };
}) => {
  const [loading, setLoading] = useState(false);
  const [showBio, setShowBio] = useState(false);

  const sendRequest = async () => {
    setLoading(true);
    try {
      const getSupabaseUser = await getData();
      if (!getSupabaseUser?.userId) {
        toast.error("Please login first");
        return;
      }

      const getMongoUser = await getCurrentUser({ supabaseId: getSupabaseUser.userId });
      if (!getMongoUser?.success || !getMongoUser.userId) {
        toast.error("User profile not found");
        return;
      }

      const result = await sendChatRequest({
        userId: getMongoUser.userId,
        oppUserId: user.id,
      });

      if (result.success) {
        toast.success(result.message || "Request sent!");
      } else {
        toast.error(result.message || "Failed to send");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-white rounded-[40px] p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-sky-900/10 transition-all duration-700 hover:-translate-y-2 overflow-hidden relative">
      {/* 🎭 Header Section with Tilt Avatar */}
      <div className="flex flex-col items-center mb-8 gap-4">
        <div className="relative group/avatar">
          <div className="w-24 h-24 rounded-[36px] overflow-hidden rotate-6 shadow-2xl transition-transform group-hover:rotate-0 duration-700 ring-4 ring-white ring-offset-8 ring-offset-slate-50">
            <Image 
              width={96} 
              height={96} 
              src={user.image || "/profile.png"} 
              alt="profile" 
              className="w-full h-full object-cover -rotate-6 group-hover:rotate-0 transition-transform duration-700 scale-110 group-hover:scale-100"
            />
          </div>
          <div className="absolute -right-2 bottom-0 w-8 h-8 bg-sky-600 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg shadow-sky-900/20 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
             <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-black text-slate-800 tracking-tight mb-1 group-hover:text-sky-900 transition-colors">
            {user.name}
          </h2>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest italic opacity-60">@{user.email.split('@')[0]}</p>
        </div>
      </div>

      {/* 📜 Bio & Stats Section */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-slate-100" />
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Explorer</span>
          </div>
          <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-slate-100" />
        </div>
        
        <p className="text-[14px] text-slate-500 font-medium text-center leading-relaxed italic line-clamp-2 px-2">
          "{user.bio || `Hey! I'm ${user.name}. Let's chat on Talky!`}"
        </p>
      </div>

      {/* 🚀 Action Area */}
      <div className="relative">
         <button
            onClick={sendRequest}
            disabled={loading}
            className="w-full h-14 bg-sky-800 hover:bg-sky-900 disabled:bg-slate-100 disabled:text-slate-300 text-white rounded-[24px] font-black text-[13px] uppercase tracking-widest overflow-hidden transition-all active:scale-[0.95] shadow-xl shadow-sky-900/10 flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Add Friend</span>
              </>
            )}
          </button>
      </div>

      {/* 🎨 Background Ornament */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-sky-50 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </div>
  );
};

export default AvailableUsersCard;
