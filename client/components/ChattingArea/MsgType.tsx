"use client";
import { handleImageUpload, sendMessage } from "@/actions/MessageActions";
import { useMessage } from "@/context/MessageContext";
import { useServer } from "@/context/ServerContext";
import { useUser } from "@/context/UserContext";
import { Message, User } from "@/lib/generated/prisma";
import EmojiPicker from "emoji-picker-react";
import { ImageUp, Mic, Send, Smile, X, UserX2, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const MsgType = ({
  data: { setTempMsg, setMessages, oppUser },
}: {
  data: {
    setTempMsg: (tempMsg: Message | null) => void;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    oppUser: any;
  };
}) => {
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { selectedUser } = useMessage();
  const { socket } = useServer();
  const { user: senderUser } = useUser();
  const [isSending, setIsSending] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // 🧹 Memory Management: Manage the object URL lifecycle to prevent crashes
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Free memory when the component is unmounted or when the file changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput && !file) return;

    if (!senderUser?.id || !selectedUser || !socket) {
      toast.error("Connecting to server...");
      return;
    }

    setIsSending(true);

    try {
      let fileUrl = null;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", "images");
        formData.append("senderUser", senderUser.id);

        const upload = await handleImageUpload(formData);
        if (!upload.success) throw new Error(upload.message as string);
        fileUrl = upload.message as string;
      }

      const tempId = `temp-${Date.now()}`;
      const messageData: Message = {
        id: tempId,
        senderId: senderUser.id,
        receiverId: selectedUser,
        text: trimmedInput,
        fileLink: fileUrl || null,
        type: file ? "image" : "text",
        status: "unseen",
        createdAt: new Date(),
        edited: false,
        updatedAt: new Date(),
      };

      // 1. Optimistic UI Update (temporary message)
      setTempMsg(messageData);
      setInput("");
      setFile(null);

      // 2. Clear Picker
      setShowPicker(false);

      // 3. Save to Database
      const sendResponse = await sendMessage({
        senderId: messageData.senderId,
        receiverId: messageData.receiverId,
        text: messageData.text || "",
        type: messageData.type,
        fileLink: messageData.fileLink || undefined,
      });

      if (sendResponse.success && sendResponse.data) {
        const savedMessage = sendResponse.data as Message;

        // 4. Update local messages list with REAL object (with actual ID)
        setMessages((prev) => [...prev, savedMessage]);

        // 5. Emit socket event
        socket.emit("sendMessage", savedMessage);
      } else {
        toast.error("Message failed to sync");
        setInput(trimmedInput); // Restore on failure
      }

    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
      setInput(trimmedInput); // Restore input on error
    } finally {
      setIsSending(false);
      setTempMsg(null); // 6. Clear temp message - local list now has the real one
    }
  };

  const handleEmojiClick = (emojiData: any) => {
      setInput((prev) => prev + emojiData.emoji);
      // We don't close picker here so user can add multiple emojis
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isUnfriended = oppUser?.isFriend === false;

  return (
    <div className="w-full bg-slate-50/50 px-4 sm:px-6 py-4 border-t border-slate-200/60 backdrop-blur-md relative">
      {isUnfriended && (
        <div className="flex items-center gap-2 mb-3 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl animate-in scale-in-95 duration-500">
          <UserX2 className="w-3.5 h-3.5 text-rose-500" />
          <p className="text-[10px] text-rose-600 font-black uppercase tracking-wider">
            Relationship restricted. Chats are still saved.
          </p>
        </div>
      )}

      {/* 🖼️ Sleek Image Preview Card */}
      {preview && (
        <div className="flex items-center gap-3 p-2 bg-white rounded-2xl shadow-xl shadow-sky-900/10 mb-4 w-max animate-in slide-in-from-bottom-4 duration-500 ring-2 ring-sky-100 border border-white">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100">
            <img
              className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
              src={preview}
              alt="Preview"
            />
          </div>
          <div className="flex flex-col pr-3">
            <span className="text-[9px] text-sky-600 font-black uppercase tracking-widest leading-none mb-1">Upload Photo</span>
            <span className="text-[12px] text-slate-800 font-bold max-w-[140px] truncate uppercase">{file?.name}</span>
            <span className="text-[10px] text-slate-400 font-medium">Ready to send</span>
          </div>
          <button
            onClick={() => setFile(null)}
            className="w-8 h-8 hover:bg-rose-50 rounded-full flex items-center justify-center transition-all group"
          >
            <X className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
          </button>
        </div>
      )}

      <div className={`relative flex items-center gap-2.5 bg-white p-2 pl-4 rounded-[22px] shadow-sm border border-slate-200 focus-within:border-sky-500/30 focus-within:ring-4 focus-within:ring-sky-500/5 transition-all duration-300 ${isSending ? 'opacity-80' : ''}`}>
        <button
          onClick={() => setShowPicker((prev) => !prev)}
          ref={buttonRef}
          className={`text-slate-400 hover:text-sky-600 transition-all p-1.5 rounded-full active:scale-90 ${showPicker ? 'bg-sky-50 text-sky-600' : 'hover:bg-slate-50'}`}
        >
          <Smile className="w-6 h-6" />
        </button>

        {showPicker && (
          <div className="absolute bottom-full mb-6 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden border border-slate-100" ref={pickerRef}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}

        <input
          type="text"
          value={input}
          disabled={isSending}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
          className="flex-1 bg-transparent border-none outline-none text-slate-800 text-[15px] font-medium placeholder:text-slate-400 py-1.5"
          placeholder={isSending ? "Preparing..." : "Type a message..."}
        />

        <div className="flex items-center gap-0.5 pr-1">
          <label className="p-2 text-slate-400 hover:text-sky-600 cursor-pointer transition-all hover:bg-sky-50 rounded-full active:scale-95 group">
            <ImageUp className="w-6 h-6 group-hover:rotate-6 transition-transform" />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
          </label>

          <button className="hidden sm:flex p-2 text-slate-400 hover:text-sky-600 transition-all hover:bg-sky-50 rounded-full active:scale-95">
            <Mic className="w-6 h-6" />
          </button>

          <button
            onClick={handleSendMessage}
            disabled={(!input.trim() && !file) || isSending}
            className="ml-1 sm:ml-2 h-10 px-5 sm:px-6 bg-sky-800 hover:bg-sky-900 disabled:bg-slate-100 disabled:text-slate-300 text-white rounded-[18px] font-bold text-[14px] flex items-center gap-2 shadow-lg shadow-sky-900/10 transition-all active:scale-[0.97]"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin text-white/50" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{isSending ? "Syncing" : "Send"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MsgType;
