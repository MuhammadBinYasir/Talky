import { Message } from "@/lib/generated/prisma";

// utils/dateGroups.ts
export const groupMessagesByDate = (messages: Message[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: Record<string, Message[]> = {};

  messages.forEach((message) => {
    const messageDate = new Date(message.createdAt);
    messageDate.setHours(0, 0, 0, 0);

    let groupKey;
    if (messageDate.getTime() === today.getTime()) {
      groupKey = "Today";
    } else if (messageDate.getTime() === yesterday.getTime()) {
      groupKey = "Yesterday";
    } else {
      groupKey = messageDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(message);
  });

  return groups;
};
