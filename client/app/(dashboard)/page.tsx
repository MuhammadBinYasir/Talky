"use client";
import Image from "next/image";
import {
  Search,
  Calendar,
  MessageCircle,
  ImageUp,
  Mic,
  Send,
  Check,
  CheckCheck,
  Play,
  Pause,
  SearchIcon,
  Smile,
  Info,
} from "lucide-react";
import WavesurferPlayer from "@wavesurfer/react";
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useMessage } from "@/context/MessageContext";
import { getCurrentUser } from "@/actions/UserActions";
import toast from "react-hot-toast";
import { formatDateAsDMY, isUserOnline } from "@/lib/utils";
import Message from "@/components/Message/Message";
import ImageMessage from "@/components/Message/ImageMessage";
import { io, Socket } from "socket.io-client";
import { text } from "stream/consumers";
import { useUser } from "@/context/UserContext";
import { useServer } from "@/context/ServerContext";
import { fetchMessages, sendMessage } from "@/actions/MessageActions";
import { groupMessagesByDate } from "@/components/Message/MessageGroup";
import EmojiPicker from "emoji-picker-react";
import Topbar from "@/components/Topbar";
import { usePathname } from "next/navigation";

export default function Home() {
  type MessageType = "text" | "image" | "audio";
  // type MessageStatus = "unseen" | "seen";

  interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    text: string | null;
    type: string;
    fileLink: string | null;
    status: string;
    edited: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState<{
    supabaseId: string;
    id: string;
    name: string;
    email: string;
    image: string;
    bio: string;
    createdAt: Date;
    updatedAt: Date;
  }>();
  const { selectedUser } = useMessage();
  const { user: senderUser } = useUser();
  const { socket, onlineUsers } = useServer();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // const onReady = (ws: any) => {
  //   setWavesurfer(ws);
  //   setIsPlaying(false);
  // };

  // const onPlayPause = () => {
  //   // wavesurfer && wavesurfer.playPause();
  // };

  useEffect(() => {
    if (!socket || !selectedUser || !senderUser?.id) return;

    const handleReceiveMessage = (data: any) => {
      // Only add message if it belongs to current chat
      if (
        (data.senderId === selectedUser && data.receiverId === senderUser.id) ||
        (data.senderId === senderUser.id && data.receiverId === selectedUser)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("ReceiveMessage", handleReceiveMessage);

    return () => {
      socket.off("ReceiveMessage", handleReceiveMessage);
    };
  }, [socket, selectedUser, senderUser?.id]); // Add selectedUser to dependencies

  useEffect(() => {
    setMessages([]); // Clear previous messages
    if (!selectedUser || !senderUser?.id) return;

    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await getCurrentUser({ userId: selectedUser });
        if (!userResponse?.success) throw new Error(userResponse?.message);

        setUser(userResponse.data);

        // Fetch messages
        const messagesResponse = await fetchMessages({
          senderId: senderUser.id,
          receiverId: selectedUser, // Use selectedUser directly
        });

        if (messagesResponse.success) {
          if (messagesResponse.data.length > 0) {
            setMessages(messagesResponse.data);
          }
        } else {
          throw new Error(`${messagesResponse.message}`);
        }
      } catch (error) {
        toast.error(`${error}` || "Failed to load chat");
      }
    };

    fetchData();
  }, [selectedUser, senderUser?.id]); // Removed user from dependencies

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({
      behavior,
      block: "nearest", // Prevents unwanted page jumps
    });
  }, []);
  const handleSendMessage = async () => {
    try {
      // Validate inputs
      if (!input.trim()) {
        toast.error("Message cannot be empty");
        return;
      }

      if (!senderUser?.id || !selectedUser || !socket) {
        toast.error("Chat session not ready");
        return;
      }

      // Optimistically update UI
      const tempId = Date.now().toString(); // Temporary ID for local tracking
      const messageData = {
        id: tempId,
        senderId: senderUser.id,
        receiverId: selectedUser,
        text: input,
        fileLink: null,
        type: "text",
        status: "unseen",
        createdAt: new Date(),
        edited: false,
        updatedAt: new Date(),
      };

      setInput("");
      scrollToBottom();

      // Send to server
      const send = await sendMessage({
        senderId: senderUser.id,
        receiverId: selectedUser,
        text: input,
        type: "text",
      });

      if (!send.success) {
        // Update status if failed
        toast.error("Error While Sending Message");
      }

      // setMessages((prev) =>
      // [...prev, send.data]
      // );

      // Emit via socket
      socket.emit("sendMessage", messageData);
      scrollToBottom();
    } catch (error) {
      toast.error(`${error}`);
      console.error("Message send error:", error);
    }
  };

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [messages, autoScroll, scrollToBottom]);

  // Add scroll event listener to detect manual scrolling
  useEffect(() => {
    const container = messagesEndRef.current?.parentElement;
    if (!container) return;

    const handleScroll = () => {
      const isAtBottom =
        container.scrollHeight - container.scrollTop === container.clientHeight;
      setAutoScroll(isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

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
  const handleEmojiClick = (emojiData: any) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowPicker(false);
  };

  const groupedMessages = groupMessagesByDate(messages);
  const pathname = usePathname();

  if (!user) return <p>Loading....</p>;

  return (
    <>
      <div className="w-full min-h-20 bg-white border-b border-b-neutral-200 flex items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full relative">
            <Image
              width={40}
              height={40}
              alt=""
              src="/assets/profile.png"
              className="w-full h-full rounded-full"
            />
            <div className="absolute w-4 h-4 rounded-full bg-green-400 -right-1 bottom-0 border-4 border-white"></div>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-md text-neutral-800 font-semibold">
              {user?.name}
            </h4>
            <div className="flex gap-2">
              <div className="text-xs bg-sky-50 rounded-full pl-2 pr-4 py-[2px] w-max text-sky-800 flex items-center gap-2">
                <p className="w-2 h-2 rounded-full bg-sky-800"></p>{" "}
                {selectedUser &&
                onlineUsers &&
                isUserOnline(selectedUser, onlineUsers)
                  ? "Online"
                  : "Offline"}
              </div>
              <p className="text-xs bg-yellow-50 rounded-full pl-2 pr-4 py-[2px] w-max text-yellow-800 flex items-center gap-2">
                <Calendar className="text-yellow-800 w-3 h-3" />
                {formatDateAsDMY({ date: user?.createdAt })}
              </p>
              <p className="text-xs bg-purple-50 rounded-full pl-2 pr-4 py-[2px] w-max text-purple-700 flex items-center gap-2">
                <MessageCircle className="text-purple-800 w-3 h-3" />{" "}
                {messages.length} Messages
              </p>
            </div>
          </div>
        </div>
        <div>
          <Info className="w-5 h-5" />
        </div>
      </div>

      <div className="no-scrollbar w-full overflow-y-auto min-h-[calc(100vh-160px)] h-[calc(100vh-160px)] flex flex-col gap-2">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div className="w-full flex-1 space-y-4 p-4" key={date}>
            <p className="flex justify-center px-2 py-1 w-max rounded-full bg-neutral-200 font-bold mx-auto text-neutral-500 text-xs">
              {date}
            </p>
            {dateMessages.map((item, index) => {
              const MessageType =
                item.senderId === senderUser?.id ? "Send" : "Receive";
              return (
                <Message
                  time={item.createdAt}
                  key={index}
                  type={MessageType}
                  text={item.text}
                  status={item.status}
                />
              );
            })}
          </div>
        ))}
        {/* <div className="w-auto flex items-end gap-2">
        
        <div className="bg-white rounded-xl px-4 py-3 rounded-br-none max-w-1/2 min-w-1/4">
            <p className="text-neutral-700 text-xs break-all leading-5">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt
              eos similique vitae ut voluptatibus accusamus temporibus quos
              autem. Autem consequuntur corrupti ducimus architecto, numquam
              sequi asperiores debitis fugiat nisi accusantium.
            </p>
            <div className="flex flex-col w-full mt-2 items-end justify-end gap-2">
              <p className="text-neutral-600 text-xs">6:02 AM</p>
            </div>
          </div>
        </div>

        <div className="w-auto flex items-end gap-2">
          <div className="bg-white rounded-xl px-4 py-3 rounded-br-none max-w-1/4 min-w-1/4">
            <img src="/assets/img1.png" className="w-full rounded-md" alt="" />
            <p className="text-neutral-700 text-xs break-all leading-5 mt-4">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Incidunt
              eos similique vitae ut voluptatibus accusamus temporibus quos
              autem. Autem consequuntur corrupti ducimus architecto, numquam
              sequi asperiores debitis fugiat nisi accusantium.
            </p>
            <div className="flex flex-col w-full mt-2 items-end justify-end gap-2">
              <p className="text-neutral-600 text-xs">6:02 AM</p>
            </div>
          </div>
        </div>

        <div className="justify-end w-auto flex items-end gap-2 ml-auto">
          <div className="bg-sky-800 rounded-xl px-4 py-3 rounded-br-none max-w-1/2 min-w-1/4">
            <p className="text-white text-xs break-all leading-5">Hy Dear!!</p>
            <div className="flex w-full mt-2 items-end justify-end gap-2">
              <p className="text-slate-200 text-xs">6:02 AM</p>
              <p className="text-slate-200 text-xs">
                <CheckCheck className="w-4 h-4" />
              </p>
            </div>
          </div>
        </div>
        <div className="justify-end w-auto flex items-end gap-2 ml-auto">
          <div className="flex items-center gap-3 bg-sky-800 rounded-xl px-4 py-3 rounded-br-none max-w-1/2 min-w-1/4">
            <button className="text-white" onClick={onPlayPause}>
              {isPlaying ? <Pause /> : <Play />}
            </button>

            <div className="w-full">
              <WavesurferPlayer
                height={30}
                waveColor="#fff"
                progressColor="#afc5da"
                cursorWidth={1}
                barWidth={1}
                barGap={1}
                url="/assets/sound.mp3"
                onReady={onReady}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
            <div className="flex w-full mt-2 items-end justify-end gap-2">
              <p className="text-slate-200 text-xs">6:02 AM</p>
              <p className="text-slate-200 text-xs">
                <Check className="w-4 h-4" />
              </p>
            </div>
          </div>
        </div>
        <div className="justify-end w-auto flex items-end gap-2 ml-auto">
          <div className="bg-sky-800 rounded-xl px-4 py-3 rounded-br-none max-w-1/4 min-w-1/4">
            <img src="/assets/img2.jpg" className="w-full rounded-md" alt="" />

            <p className="text-white text-xs break-all leading-5 mt-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Laboriosam earum illo, sit voluptatum eveniet similique voluptate
              corrupti enim veritatis vel modi nisi voluptas dolore maiores
              cumque exercitationem, ut quod voluptates.
            </p>
            <div className="flex w-full mt-2 items-end justify-end gap-2">
              <p className="text-slate-200 text-xs">6:02 AM</p>
              <p className="text-slate-200 text-xs">
                <Check className="w-4 h-4" />
              </p>
            </div>
          </div>
        </div>
        <div className="justify-end w-auto flex items-end gap-2 ml-auto">
          <div className="flex items-center gap-3 bg-sky-800 rounded-xl px-4 py-3 rounded-br-none w-1/2">
            <button className="text-white" onClick={onPlayPause}>
              {isPlaying ? <Pause /> : <Play />}
            </button>

            <div className="w-full">
              <WavesurferPlayer
                height={30}
                waveColor="#fff"
                progressColor="#afc5da"
                cursorWidth={1}
                barWidth={1}
                barGap={1}
                url="/assets/sound2.mp3"
                onReady={onReady}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
            <div className="flex w-full mt-2 items-end justify-end gap-2">
              <p className="text-slate-200 text-xs">6:02 AM</p>
              <p className="text-slate-200 text-xs">
                <Check className="w-4 h-4" />
              </p>
            </div>
          </div>
        </div> */}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="w-full max-h-20 min-h-20 px-5 py-2">
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
          <div className="w-11 aspect-square flex items-center justify-center cursor-pointer text-neutral-800 rounded-full">
            <ImageUp className="w-5 h-5" />
          </div>
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
    </>
  );
}
