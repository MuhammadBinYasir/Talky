import { Ref, RefObject, useCallback } from "react";

export const formatDateAsDMY = ({ date }: { date: Date }) => {
  const formatted = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return formatted;
};

export const formatDateAsAMPM = ({ date }: { date: Date }) => {
  const formatted = new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return formatted;
};

export const isUserOnline = (
  userId: string,
  onlineUsers: Record<string, string>
) => {
  return !!onlineUsers?.[userId];
};

export function scrollToBottom(
  ref: React.RefObject<HTMLDivElement | null>,
  behavior: ScrollBehavior = "smooth"
) {
  ref.current?.scrollIntoView({
    behavior,
    block: "end",
  });
}