"use client"

import React, { useCallback, useEffect, useRef, useState } from "react";
import Message from "@/components/Message/Message";
import ImageMessage from "@/components/Message/ImageMessage";
import { useMessage } from "@/context/MessageContext";
import { useServer } from "@/context/ServerContext";
import { useUser } from "@/context/UserContext";
import { Message as MessageType, User } from "@/lib/generated/prisma";
import { getCurrentUser } from "@/actions/UserActions";
import { groupMessagesByDate } from "../Message/MessageGroup";
import SelectedUserLoading from "../Errors/SelectedUserLoading";
// import { scrollToBottom } from "@/lib/utils";
import { ChevronsDown } from "lucide-react";
import toast from "react-hot-toast";
import { fetchMessages, markAsSeen } from "@/actions/MessageActions";
import ChattingAreaLoading from "./ChattingAreaLoading";
import { scrollToBottom } from "@/lib/utils";

const ChattingArea = ({
  data: { messages, setMessages, user, setUser, tempMsg },
}: {
  data: {
    messages: MessageType[];
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
    user: User | null;
    setUser: (user: User | null) => void;
    tempMsg: MessageType | null;
  };
}) => {
  const { selectedUser } = useMessage();
  const { socket } = useServer();
  const { user: senderUser } = useUser();
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(true);

  useEffect(() => {
    if (!senderUser || !selectedUser || !socket) return;

    const markSeen = async () => {
      await markAsSeen({
        senderId: selectedUser,
        receiverId: senderUser.id,
      });

      socket.emit("messageSeen", {
        senderId: selectedUser,
        receiverId: senderUser.id,
      });
    };

    markSeen();
  }, [selectedUser, messages]);

  useEffect(() => {
    if (!socket) return;

    const seenHandler = ({ by }: { by: string }) => {
      setMessages((prev: MessageType[]) =>
        prev.map((msg) =>
          msg.senderId === by ? { ...msg, status: "seen" } : msg
        )
      );
    };

    socket.on("messageSeen", seenHandler);

    return () => {
      socket.off("messageSeen", seenHandler);
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    if (!socket || !selectedUser || !senderUser?.id) return;

    const handleReceiveMessage = (data: MessageType) => {
      // Avoid duplicate messages if already in list
      setMessages((prev: MessageType[]) => {
        if (prev.some((m) => m.id === data.id)) return prev;

        // Only add if it belongs to current chat
        if (
          (data.senderId === selectedUser && data.receiverId === senderUser.id) ||
          (data.senderId === senderUser.id && data.receiverId === selectedUser)
        ) {
          return [...prev, data];
        }
        return prev;
      });
    };

    socket.on("ReceiveMessage", handleReceiveMessage);

    return () => {
      socket.off("ReceiveMessage", handleReceiveMessage);
    };
  }, [socket, selectedUser, senderUser?.id]);

  useEffect(() => {
    setMessages([]);
    if (!selectedUser || !senderUser?.id) return;

    setLoading(true);

    const fetchData = async () => {
      try {
        const userResponse = await getCurrentUser({ userId: selectedUser });
        if (userResponse.data) setUser(userResponse.data);

        const messagesResponse = await fetchMessages({
          senderId: senderUser.id,
          receiverId: selectedUser,
        });

        if (messagesResponse.success) {
          setMessages(messagesResponse.data);
        } else {
          toast.error(messagesResponse.message || "Failed to load messages");
        }
      } catch (error) {
        toast.error("Failed to load chat session");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    setAutoScroll(true);
    fetchData();
  }, [selectedUser, senderUser?.id]);

  const prevMessagesLength = useRef(messages.length);

  useEffect(() => {
    const container = messagesEndRef.current?.parentElement;
    if (!container) return;

    const handleScroll = () => {
      // Check if user is within 100px of bottom
      const isAtBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
      setAutoScroll(isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Scroll instantly on initial load or user change
    if (messages.length > 0 && !loading && autoScroll) {
      scrollToBottom(messagesEndRef, "auto");
    }
    prevMessagesLength.current = messages.length;
  }, [selectedUser, loading]);

  useEffect(() => {
    // Only scroll if actually adding a new message or temp message, or if autoScroll is active
    const lengthIncreased = messages.length > prevMessagesLength.current;

    if (autoScroll && (lengthIncreased || tempMsg)) {
      scrollToBottom(messagesEndRef, "smooth");
    }

    prevMessagesLength.current = messages.length;
  }, [messages.length, tempMsg, autoScroll]);

  const groupedMessages = groupMessagesByDate(messages);

  if (!user || loading) return <ChattingAreaLoading />;

  return (
    <div
      className="w-full overflow-y-auto h-full overflow-x-hidden flex flex-col scroll-smooth custom-scrollbar"
      style={{ scrollbarGutter: 'stable' }}
    >
      <div className="w-full flex-1 flex flex-col gap-2 p-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="w-full space-y-4 mb-4">
            <div className="flex justify-center">
              <span className="px-3 py-1 bg-neutral-100 rounded-full text-neutral-500 font-semibold text-[10px] uppercase tracking-wider backdrop-blur-sm shadow-sm border border-neutral-200">
                {date}
              </span>
            </div>
            {dateMessages.map((item) => {
              const isSender = item.senderId === senderUser?.id;
              const type = isSender ? "Send" : "Receive";

              if (item.type === "text" && !item.fileLink) {
                return <Message key={item.id} data={item} type={type} />;
              }

              return (
                <ImageMessage
                  key={item.id}
                  type={type}
                  text={item.text}
                  status={item.status}
                  image={item.fileLink || ""}
                  time={item.createdAt}
                  onload={() => autoScroll && scrollToBottom(messagesEndRef, "smooth")}
                />
              );
            })}
          </div>
        ))}

        {tempMsg && (
          <div className="opacity-70 transition-opacity">
            {tempMsg.type === "text" ? (
              <Message data={tempMsg} type="Send" />
            ) : (
              <ImageMessage
                type="Send"
                text={tempMsg.text}
                status="unseen"
                image={tempMsg.fileLink || ""}
                time={tempMsg.createdAt}
                onload={() => scrollToBottom(messagesEndRef, "smooth")}
              />
            )}
          </div>
        )}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      <div
        onClick={() => scrollToBottom(messagesEndRef, "smooth")}
        className={`fixed bottom-24 right-6 mb-4 z-20 aspect-square w-10 h-10 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-lg border border-neutral-100 transition-all duration-300 hover:bg-neutral-50 ${!autoScroll && messages.length > 5 ? "scale-100 translate-y-0" : "scale-0 translate-y-10"
          }`}
      >
        <ChevronsDown className="w-5 h-5 text-sky-600" />
      </div>
    </div>
  );
};

export default ChattingArea;
