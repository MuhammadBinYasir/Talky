"use server";

import { PrismaClient } from "@/lib/generated/prisma";
import { supabase } from "@/lib/supabase/Client";

const prisma = new PrismaClient();

export const sendMessage = async ({
  senderId,
  receiverId,
  text,
  fileLink,
  type,
  status = "unseen",
}: {
  senderId: string;
  receiverId: string;
  text?: string;
  fileLink?: string;
  type: string;
  status?: string;
}) => {
  try {
    const send = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        type,
        text,
        status,
        fileLink,
      },
    });
    return { success: true, data: send };
  } catch (error) {
    return { success: false, message: "Failed to send message", data: null };
  }
};

export const fetchMessages = async ({
  senderId,
  receiverId,
}: {
  senderId: string;
  receiverId: string;
}) => {
  try {
    const fetch = await prisma.message.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });
    return { success: true, data: fetch };
  } catch (error) {
    return { success: false, message: "Failed to fetch messages", data: [] };
  }
};

export const fetchImages = async ({
  senderId,
  receiverId,
}: {
  senderId: string;
  receiverId: string;
}) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        type: "image",
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    const images = messages.map((img) => img.fileLink).filter(Boolean);
    return { success: true, data: images };
  } catch (error) {
    return { success: false, data: [] };
  }
};

export const handleImageUpload = async (formData: FormData) => {
  try {
    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string;
    const senderUser = formData.get("senderUser") as string;

    if (!senderUser || !file || !bucket) {
      return { success: false, message: "Invalid parameters" };
    }
    
    const ext = file.name.split(".").pop();
    const filePath = `${senderUser}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true });

    if (uploadError) return { success: false, message: uploadError.message };

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return { success: true, message: data.publicUrl };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const markAsSeen = async ({
  receiverId,
  senderId,
}: {
  receiverId: string;
  senderId: string;
}) => {
  try {
    await prisma.message.updateMany({
      where: {
        senderId,
        receiverId,
        status: "unseen",
      },
      data: { status: "seen" },
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: "Update failed" };
  }
};

export const LastMessage = async ({
  senderId,
  receiverId,
}: {
  senderId: string;
  receiverId: string;
}) => {
  try {
    const lastMessage = await prisma.message.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: !!lastMessage, data: lastMessage };
  } catch (error) {
    return { success: false, data: null };
  }
};

export const countUnreadMessages = async ({
  receiverId,
  senderId,
}: {
  receiverId: string;
  senderId: string;
}) => {
  try {
    const count = await prisma.message.count({
      where: {
        senderId,
        receiverId,
        status: "unseen",
      },
    });
    return { success: true, count };
  } catch (error) {
    return { success: false, count: 0 };
  }
};
