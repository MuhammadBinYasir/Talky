"use server";

import { PrismaClient } from "@/lib/generated/prisma";

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
