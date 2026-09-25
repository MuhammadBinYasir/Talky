"use client";
import { fetchImages } from "@/actions/MessageActions";
import { unfriend } from "@/actions/UserActions";
import { useMessage } from "@/context/MessageContext";
import { useUser } from "@/context/UserContext";
import { ChevronLeft, UserMinus, ShieldAlert, Users, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserInfo = ({
  data: { setViewInfo, oppUser },
}: {
  data: {
    setViewInfo: (viewInfo: boolean) => void;
    oppUser: any;
  };
}) => {
  const { user: currentUser } = useUser();
  const { selectedUser } = useMessage();
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    const getImages = async () => {
      const res = await fetchImages({
        senderId: currentUser.id,
        receiverId: selectedUser,
      });

      if (res.success && res.data.length) {
        setData(res.data.filter((img): img is string => img !== null));
      }
    };

    getImages();
  }, [currentUser, selectedUser]);

  const handleUnfriend = async () => {
    if (!currentUser || !oppUser) return;
    if (!window.confirm(`Are you sure you want to unfriend ${oppUser.name}? You can still chat, but they will be removed from your friends list.`)) return;

    setLoading(true);
    try {
      const res = await unfriend({ 
        userId: currentUser.id, 
        oppUserId: oppUser.id 
      });
      if (res.success) {
        toast.success(res.message);
        setViewInfo(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Unfriend failed");
    } finally {
      setLoading(false);
    }
  };

  if (!oppUser) return (
    <div className="p-8 animate-pulse space-y-4">
      <div className="w-20 h-20 rounded-2xl bg-slate-100" />
      <div className="h-6 w-32 bg-slate-100 rounded-full" />
      <div className="h-4 w-48 bg-slate-50 rounded-full" />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto custom-scrollbar border-l border-slate-100 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <button 
          onClick={() => setViewInfo(false)}
          className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-600 active:scale-90"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
           <h2 className="text-[17px] font-black text-slate-800 tracking-tight leading-none">Chat Info</h2>
           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">Opponent Profile</span>
        </div>
      </div>

      {/* Profile Card */}
      <div className="p-8 flex flex-col items-center border-b border-slate-100 bg-slate-50/30">
        <div className="relative group mb-6">
          <div className="w-24 h-24 rounded-[32px] overflow-hidden rotate-3 shadow-xl transition-transform group-hover:rotate-6 duration-500 ring-4 ring-white ring-offset-4 ring-offset-slate-50">
            <Image 
              width={96} 
              height={96} 
              src={oppUser.image || "/profile.png"} 
              alt={oppUser.name} 
              className="w-full h-full object-cover -rotate-3 transition-transform group-hover:scale-110"
            />
          </div>
          <div className="absolute -right-1 bottom-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-sm" />
        </div>
        
        <div className="text-center space-y-1">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">{oppUser.name}</h2>
          <p className="text-[13px] text-slate-400 font-bold uppercase tracking-widest leading-none pb-1">
            @{oppUser.email.split('@')[0]}
          </p>
          <div className="pt-3">
             <div className="px-5 py-2 bg-white rounded-2xl text-slate-500 text-[12px] font-bold border border-slate-100 shadow-sm leading-relaxed max-w-[200px]">
               {oppUser.bio || "Available for chat..."}
             </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8 flex-1">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-400" />
              <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-widest">Shared Media</h3>
            </div>
            <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full">{data.length} Total</span>
          </div>
          
          {data.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {data.slice(0, 6).map((item, index) => (
                <div key={index} className="aspect-square rounded-xl overflow-hidden bg-slate-100 group cursor-pointer border border-slate-100 shadow-sm relative">
                  <Image
                    src={item}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
                    width={100}
                    height={100}
                    alt="Media"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <Users className="w-8 h-8 text-slate-200 mb-2" />
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">No shared media</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
           <div className="px-4 py-3 bg-rose-50 rounded-2xl border border-rose-100 mb-2">
             <div className="flex items-center gap-2 text-rose-600 mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-widest">Danger Zone</span>
             </div>
             <p className="text-[10px] text-rose-400 font-bold leading-tight">Unfriending will stop real-time status updates but preserve chat history.</p>
           </div>
           
           <button 
             onClick={handleUnfriend}
             disabled={loading}
             className="w-full h-12 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-100 disabled:text-slate-300 text-white text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-900/10 active:scale-[0.98]"
           >
             {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserMinus className="w-4 h-4" /> Unfriend User</>}
           </button>
           <button className="w-full h-12 bg-white hover:bg-slate-50 text-slate-400 text-sm font-bold rounded-2xl transition-all border border-slate-100 flex items-center justify-center gap-2 mt-4 hover:text-slate-600">
             Report Account
           </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
