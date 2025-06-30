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
import { fetchMessages } from "@/actions/MessageActions";
import ChattingAreaLoading from "./ChattingAreaLoading";
import { scrollToBottom } from "@/lib/utils";

const ChattingArea = ({
  data: { messages, setMessages, user, setUser },
}: {
  data: {
    messages: MessageType[];
    setMessages: (prev: any) => void;
    user: User | null;
    setUser: (user: User) => void;
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
    if (!socket || !selectedUser || !senderUser?.id) return;

    const handleReceiveMessage = (data: any) => {
      // Only add message if it belongs to current chat
      if (
        (data.senderId === selectedUser && data.receiverId === senderUser.id) ||
        (data.senderId === senderUser.id && data.receiverId === selectedUser)
      ) {
        setMessages((prev: any) => [...prev, data]);
      }
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
        if (!userResponse?.success && !userResponse.data)
          toast.error(userResponse?.message);

        if (userResponse.data) setUser(userResponse.data);

        const messagesResponse = await fetchMessages({
          senderId: senderUser.id,
          receiverId: selectedUser,
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
      setLoading(false);
    };

    fetchData();
  }, [selectedUser, senderUser?.id]);

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
    if (autoScroll) {
      if (!messagesEndRef) return;
      scrollToBottom(messagesEndRef, "smooth");
    }
  }, [messages, autoScroll]);

  const groupedMessages = groupMessagesByDate(messages);

  if (!user || loading) return <ChattingAreaLoading />;

  return (
    <div className="no-scrollbar w-full overflow-y-auto h-full flex flex-col flex-1 gap-2">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div className="w-full flex-1 space-y-4 p-4" key={date}>
          <p className="flex justify-center px-2 py-1 w-max rounded-full bg-neutral-200 font-bold mx-auto text-neutral-500 text-xs">
            {date}
          </p>
          {dateMessages.map((item, index) => {
            const MessageType =
              item.senderId === senderUser?.id ? "Send" : "Receive";

            return item.type === "text" && item.fileLink === null ? (
              <Message
                key={index}
                time={item.createdAt}
                type={MessageType}
                text={item.text}
                status={item.status}
              />
            ) : (
              item.fileLink && (
                <ImageMessage
                  key={index}
                  type={MessageType}
                  text={item.text}
                  status={item.status}
                  image={item.fileLink}
                  time={item.createdAt}
                  onload={() => scrollToBottom(messagesEndRef, "smooth")}
                />
              )
            );
          })}
        </div>
      ))}

      <div
        onClick={() => scrollToBottom(messagesEndRef, "smooth")}
        className={`sticky bottom-3 right-3 ml-auto mr-3 aspect-square w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center cursor-pointer shadow ${
          showScrollBtn ? "scale-100" : "scale-0"
        }`}
      >
        <ChevronsDown className="w-3 h-3 text-sky-600" />
      </div>
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default ChattingArea;
