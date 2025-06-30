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
  status,
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
    if (send) {
      return {
        success: true,
        data: send,
      };
    } else {
      return {
        success: false,
        data: [],
      };
    }
  } catch (error) {
    return {
      success: false,
      data: [],
    };
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
          {
            senderId,
            receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      },
    });

    if (fetch) {
      return {
        success: true,
        data: fetch,
      };
    } else {
      return {
        success: false,
        message: "Error fetching data",
        data: [],
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error,
      data: [],
    };
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
      orderBy: {
        createdAt: "desc",
      },
    });

    const images = messages.map((img) => img.fileLink);

    if (images.length > 0) {
      return {
        success: true,
        data: images,
      };
    } else {
      return {
        success: false,
        data: [],
      };
    }
  } catch (error) {
    return {
      success: false,
      data: [],
    };
  }
};

export const handleImageUpload = async ({
  file,
  bucket,
  senderUser,
}: {
  file: File;
  bucket: string;
  senderUser: string;
}) => {
  if (!senderUser || !file) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
  const ext = file.name.split(".").pop();
  const fileName = `${senderUser}-${Date.now()}.${ext}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return {
      success: false,
      message: uploadError.message,
    };
  }

  const { data } = supabase.storage.from("images").getPublicUrl(filePath);
  const publicUrl = data.publicUrl;

  return {
    success: true,
    message: publicUrl,
  };
};
