"use client";
import { updatePic, updateProfile } from "@/actions/UserActions";
import { supabase } from "@/lib/supabase/Client";
import { AtSign, Loader2, MailIcon, Pen, UploadIcon, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Input from "./Input";
import TextArea from "./Textarea";
import { User as userType } from "@/lib/generated/prisma";

const EditProfile = ({
  data: { user },
}: {
  data: {
    user: userType;
  };
}) => {
  const router = useRouter();

  const [formData, setFormData] = useState({ name: "", bio: "" });
  const [fileUrl, setFileUrl] = useState<string>("");
  const [file, setFile] = useState<File>();

  const [btnLoading, setBtnLoading] = useState(false);
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, bio: user.bio });
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFileUrl(URL.createObjectURL(selected));
    setFile(selected);
  };

  const uploadImage = async () => {
    if (!user || !file) return;

    const ext = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${ext}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error(`Upload Failed: ${uploadError.message}`);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    const updateDB = await updatePic({
      userId: user.id,
      fileUrl: publicUrl,
    });

    if (updateDB.success) {
      toast.success(`${updateDB.message}`);
      router.refresh();
    } else {
      toast.error(`${updateDB.message}`);
    }
  };

  const updateUser = async () => {
    setBtnLoading(true);
    if (!user) return;
    const update = await updateProfile({
      name: formData.name,
      bio: formData.bio,
      userId: user.id,
    });
    if (update.success) {
      toast.success(`${update.message}`);
    } else {
      toast.error(`${update.message}`);
    }
    setBtnLoading(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-start">
      {/* 🟢 LEFT: Avatar & Identity Section */}
      <div className="shrink-0 flex flex-col items-center">
        <div className="relative group cursor-pointer">
          <div className="w-40 h-40 rounded-[48px] overflow-hidden rotate-3 shadow-2xl transition-transform group-hover:rotate-0 duration-500 ring-4 ring-white ring-offset-8 ring-offset-slate-50 relative">
            <Image
              width={160}
              height={160}
              src={fileUrl || user.image || "/profile.png"}
              alt={user.name}
              className="w-full h-full object-cover -rotate-3 group-hover:rotate-0 transition-transform duration-500"
            />
            {/* Overlay */}
            <label
              htmlFor="file"
              className="absolute inset-0 bg-sky-600/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-2 pointer-events-auto cursor-pointer"
            >
              <UploadIcon className="w-8 h-8 animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-widest">New Photo</span>
            </label>
            <input
              onChange={handleImageChange}
              type="file"
              name="file"
              id="file"
              accept="image/*"
              hidden
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl animate-pulse">
             <div className="w-3 h-3 rounded-full bg-white/50" />
          </div>
        </div>

        {file && (
          <button
            onClick={uploadImage}
            className="w-full mt-8 bg-sky-800 hover:bg-sky-900 text-white py-3.5 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            Confirm Upload
          </button>
        )}

        <div className="mt-8 text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{user.name}</h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
            {user.email.split('@')[0]}
          </p>
        </div>
      </div>

      {/* 🔴 RIGHT: Form Details Section */}
      <div className="flex-1 w-full space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <Input
              Icon={User}
              inputProps={{
                placeholder: "Display Name",
                type: "text",
                value: formData?.name,
                onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              }}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username (Email-Based)</label>
            <Input
              Icon={AtSign}
              inputProps={{
                placeholder: "Username",
                type: "text",
                disabled: true,
                value: user.email.split('@')[0],
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Email</label>
          <Input
            Icon={MailIcon}
            inputProps={{
              placeholder: "Email Address",
              type: "email",
              disabled: true,
              value: user.email,
            }}
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bio Description</label>
          <TextArea
            Icon={Pen}
            inputProps={{
              placeholder: "Share something about yourself...",
              type: "text",
              value: formData?.bio,
              onChange: (e) => setFormData({ ...formData, bio: e.target.value }),
            }}
          />
        </div>

        <div className="pt-4">
           <button
            onClick={updateUser}
            disabled={btnLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-300 text-white h-14 rounded-2xl text-[13px] font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
          >
            {btnLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
