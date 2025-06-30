"use client";
import { handleImageUpload, sendMessage } from "@/actions/MessageActions";
import { useMessage } from "@/context/MessageContext";
import { useServer } from "@/context/ServerContext";
import { useUser } from "@/context/UserContext";
import EmojiPicker from "emoji-picker-react";
import { ImageUp, Mic, Send, Smile, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const MsgType = () => {
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const { selectedUser, setSelectedUser } = useMessage();
  const { socket } = useServer();
  const { user: senderUser } = useUser();

  const handleSendMessage = async () => {
    try {
      if (!input.trim() && !file) {
        toast.error("Message cannot be empty");
        return;
      }

      if (!senderUser?.id || !selectedUser || !socket) {
        toast.error("Chat session not ready");
        return;
      }

      const upload = async () => {
        if (!file) return;
        const upload = await handleImageUpload({
          senderUser: senderUser.id,
          bucket: "images",
          file: file,
        });
        if (upload.success) {
          return upload.message;
        } else {
          return toast.error(`${upload.message}`);
        }
      };

      const fileUrl = file ? await upload() : null;

      setInput("");
      setFile(null);

      const tempId = Date.now().toString();
      const messageData = {
        id: tempId,
        senderId: senderUser.id,
        receiverId: selectedUser,
        text: input,
        fileLink: fileUrl,
        type: file ? "image" : "text",
        status: "unseen",
        createdAt: new Date(),
        edited: false,
        updatedAt: new Date(),
      };
      let send;
      if (fileUrl) {
        send = await sendMessage({
          senderId: senderUser.id,
          receiverId: selectedUser,
          text: input,
          type: messageData.type,
          fileLink: fileUrl,
        });
      } else {
        send = await sendMessage({
          senderId: senderUser.id,
          receiverId: selectedUser,
          text: input,
          type: messageData.type,
        });
      }

      if (!send.success) {
        toast.error("Error While Sending Message");
      }

      socket.emit("sendMessage", messageData);
      //   scrollToBottom();
    } catch (error) {
      toast.error(`${error}`);
      console.error("Message send error:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(()=>{setFile(null)},[selectedUser])
  
  const handleEmojiClick = (emojiData: any) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };



  return (
    <div className="w-full min-h-20 px-5 py-2">
      {file && (
        <div className="w-full py-6 h-10 flex items-center justify-between p-3 rounded-full bg-white mb-2">
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8 rounded-full aspect-square"
              src={URL.createObjectURL(file)}
            />
            <p className="text-sm text-neutral-800 font-semibold">
              {file.name}
            </p>
          </div>
          <div
            onClick={() => setFile(null)}
            className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center"
          >
            <X className="w-3 h-3 text-neutral-500" />
          </div>
        </div>
      )}
      <div className="w-full h-[60px] bg-white rounded-full flex items-center pr-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => {
            if (e.code === "Enter") {
              handleSendMessage();
            }
          }}
          className="w-full h-full border-none outline-none pl-8 text-neutral-800 text-sm"
          placeholder="Type a message"
        />
        <div
          onClick={() => setShowPicker((prev) => !prev)}
          ref={buttonRef}
          className="relative w-11 aspect-square flex items-center justify-center cursor-pointer text-neutral-800 rounded-full"
        >
          <Smile className="w-5 h-5" />
          {showPicker && (
            <div className="absolute bottom-10 right-0 z-50" ref={pickerRef}>
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
        <label
          htmlFor="image"
          className="w-11 aspect-square flex items-center justify-center cursor-pointer text-neutral-800 rounded-full"
        >
          <ImageUp className="w-5 h-5" />
          <input
            type="file"
            name="image"
            id="image"
            accept="images/png"
            hidden
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </label>
        <div className="w-11 aspect-square flex items-center justify-center cursor-pointer text-neutral-800 rounded-full">
          <Mic className="w-5 h-5" />
        </div>
        <div
          onClick={handleSendMessage}
          className="pl-2 pr-4 cursor-pointer h-10 text-sm bg-sky-800 rounded-full border-none outline-none text-white flex items-center justify-center gap-2"
        >
          <Send className="w-5" /> Send
        </div>
      </div>
    </div>
  );
};

export default MsgType;
