"use client";
import {
  getCurrentUser,
  getData,
  updatePic,
  updateProfile,
} from "@/actions/UserActions";
import Input from "@/components/Input";
import TextArea from "@/components/Textarea";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabase/Client";
import { AtSign, MailIcon, Pen, UploadIcon, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const { user } = useUser();
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
    setBtnLoading(false)
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-10">
      <div className="w-full bg-white px-6 py-8 rounded-lg">
        <div className="w-1/2 flex">
          <div className="w-auto min-w-fit">
            <div className="w-25 h-25 rounded-full relative">
              <Image
                width={100}
                height={100}
                src={fileUrl || user.image}
                alt="Logo"
                className="rounded-full min-w-25 h-full"
              />

              <div>
                <label
                  htmlFor="file"
                  className="hover:scale-100 scale-20 transition-all opacity-60 flex items-center justify-center w-full h-full bg-slate-100 rounded-full absolute top-0 left-0"
                >
                  <UploadIcon />
                </label>
                <input
                  onChange={(e) => handleImageChange(e)}
                  type="file"
                  name="file"
                  id="file"
                  hidden
                />
              </div>
            </div>
            {fileUrl && (
              <button
                onClick={uploadImage}
                className="w-full mt-2 bg-sky-800 hover:bg-sky-900 text-white p-3 text-xs rounded-lg transition duration-300 cursor-pointer"
              >
                Update Image
              </button>
            )}
          </div>
          <div className="ml-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-neutral-800">
              {user?.name}
              <div className="text-xs bg-sky-50 rounded-full pl-2 pr-4 py-[2px] w-max text-sky-800 flex items-center gap-2">
                <p className="w-2 h-2 rounded-full bg-sky-800"></p> Online
              </div>
            </h2>
            <p className="text-sm text-neutral-400 flex items-center gap-1">
              <AtSign className="w-4 h-4" /> {user?.email}
            </p>
            <p className="mt-3 text-xs text-neutral-400">{user?.bio}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="">Enter Name</label>
            <Input
              Icon={User}
              inputProps={{
                placeholder: "Enter Name",
                type: "text",
                value: formData?.name,
                onChange: (e) => {
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  });
                },
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">Username</label>
            <Input
              Icon={AtSign}
              inputProps={{
                placeholder: "Username",
                type: "text",
                disabled: true,
                value: "MuhammadBinYasir",
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">Email</label>
            <Input
              Icon={MailIcon}
              inputProps={{
                placeholder: "Email Address",
                type: "email",
                disabled: true,
                value: "mbyasir5@gmail.com",
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">Bio</label>
            <TextArea
              Icon={Pen}
              inputProps={{
                placeholder: "Bio",
                type: "text",
                value: formData?.bio,
                onChange: (e) => {
                  setFormData({
                    ...formData,
                    bio: e.target.value,
                  });
                },
              }}
            />
          </div>

          <button
            onClick={updateUser}
            disabled={btnLoading}

            className="disabled:cursor-not-allowed disabled:bg-neutral-300 w-full mt-2 bg-sky-800 hover:bg-sky-900 text-white p-3 rounded-lg transition duration-300 cursor-pointer"
          >
            {btnLoading ? "Loading" : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
