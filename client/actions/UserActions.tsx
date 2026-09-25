"use server";
import { PrismaClient } from "@/lib/generated/prisma";
import { createClient } from "@/lib/supabase/Server";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export const createUser = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const supabase = await createClient();
    
    // 1. Check if user already exists in Prisma to avoid duplicate email error
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { success: false, message: "Email already registered" };

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) return { success: false, message: error.message };

    if (data?.user) {
      // 2. Create user in MongoDB
      try {
        await prisma.user.create({
          data: { 
            name, 
            email, 
            supabaseId: data.user.id,
            image: "/profile.png" 
          },
        });
      } catch (prismaError: any) {
        console.error("Prisma Error:", prismaError);
        // If Prisma fails, we should ideally delete the supabase user to allow retry, 
        // but Supabase Admin API would be needed for that. 
        // For now, return a specific error.
        return { success: false, message: "Database sync failed: " + prismaError.message };
      }
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Registration Exception:", error);
    return { success: false, message: error.message || "Signup failed" };
  }
};

export const signIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { success: false, message: error.message };
  return { success: true, data };
};

export const logOut = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { success: false, message: error.message };
  return { success: true };
};

export const getData = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return { success: true, userId: user.id };
  }
  return { success: false, error: "Not logged in" };
};

export const fetchAllUsers = async () => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "Unauthorized", data: [] };

    const currentUserResponse = await getCurrentUser({ supabaseId: user.id });
    if (!currentUserResponse?.success) return { success: false, message: "User not found", data: [] };

    const userId = currentUserResponse.userId;

    // Get IDs of people who are already friends or have pending requests
    const interactions = await prisma.friendRequests.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      select: { senderId: true, receiverId: true },
    });

    const interactedIds = interactions.flatMap((i) => [i.senderId, i.receiverId]);
    const exclusionList = Array.from(new Set([userId as string, ...interactedIds])).filter((id): id is string => !!id);

    const users = await prisma.user.findMany({
      where: {
        id: { notIn: exclusionList },
      },
    });

    return {
      success: true,
      data: users,
    };
  } catch (error: any) {
    console.error("FetchAllUsers Error:", error);
    return { success: false, message: error.message || "Fetch failed", data: [] };
  }
};

export const sendChatRequest = async ({
  oppUserId,
  userId,
}: {
  oppUserId: string;
  userId: string;
}) => {
  try {
    const existing = await prisma.friendRequests.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: oppUserId },
          { senderId: oppUserId, receiverId: userId },
        ],
      },
    });

    if (existing) return { success: false, message: "Request already exists" };

    await prisma.friendRequests.create({
      data: { senderId: userId, receiverId: oppUserId },
    });

    return { success: true, message: "Request Sent" };
  } catch (error) {
    return { success: false, message: "Failed to send request" };
  }
};

export const getCurrentUser = async ({
  supabaseId,
  userId,
}: {
  supabaseId?: string;
  userId?: string;
}) => {
  try {
    const data = await prisma.user.findFirst({
      where: supabaseId ? { supabaseId } : { id: userId },
    });

    if (!data) return { success: false, message: "User not found" };

    // If fetching someone else's profile, check if they are friends with current user
    let isFriend = true; // Default for self
    let friendStatus = "Friend";

    if (userId) {
      const auth = await getData();
      if (auth.success && auth.userId) {
        const currentUser = await prisma.user.findUnique({ where: { supabaseId: auth.userId } });
        if (currentUser && currentUser.id !== userId) {
          const friendship = await prisma.friendRequests.findFirst({
            where: {
              OR: [
                { senderId: currentUser.id, receiverId: userId, status: "accepted" },
                { senderId: userId, receiverId: currentUser.id, status: "accepted" },
              ],
            },
          });
          isFriend = !!friendship;
          friendStatus = friendship ? "Friend" : "Unfriended";
        }
      }
    }

    return { 
      success: true, 
      userId: data.id, 
      data: { ...data, isFriend, friendStatus } 
    };
  } catch (error: any) {
    console.error("GetCurrentUser Error:", error);
    return { success: false, message: "Database error" };
  }
};

export const friendsRequests = async ({ userId }: { userId: string }) => {
  try {
    const requests = await prisma.friendRequests.findMany({
      where: { receiverId: userId, status: "pending" },
      include: { sender: true },
    });

    return {
      success: requests.length > 0,
      data: requests,
      count: requests.length,
      message: requests.length > 0 ? "" : "No pending requests",
    };
  } catch (error) {
    return { success: false, message: "Fetch failed" };
  }
};

export const sentRequests = async ({ userId }: { userId: string }) => {
  try {
    const requests = await prisma.friendRequests.findMany({
      where: { senderId: userId },
      include: { receiver: true },
    });

    return {
      success: requests.length > 0,
      data: requests,
      count: requests.length,
      message: requests.length > 0 ? "" : "No sent requests",
    };
  } catch (error) {
    return { success: false, message: "Fetch failed" };
  }
};

export const countPendingRequests = async ({ userId }: { userId: string }) => {
  try {
    const count = await prisma.friendRequests.count({
      where: { receiverId: userId, status: "pending" },
    });
    return { success: true, count };
  } catch (error) {
    return { success: false, count: 0 };
  }
};

export const AcceptRejectRequest = async ({ id, type }: { id: string, type: string }) => {
  try {
    await prisma.friendRequests.update({
      where: { id },
      data: { status: type },
    });
    revalidatePath("/explore/requests");
    return { success: true };
  } catch (error) {
    return { success: false, message: "Update failed" };
  }
};

export const friends = async () => {
  try {
    const auth = await getData();
    if (!auth?.success || !auth.userId) return { success: false, data: [] };

    const currentUser = await getCurrentUser({ supabaseId: auth.userId });
    if (!currentUser.success || !currentUser.userId) return { success: false, data: [] };

    const currentUserId = currentUser.userId;

    // 1. Get all accepted friends
    const friendRequests = await prisma.friendRequests.findMany({
      where: {
        OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
        status: "accepted",
      },
      include: { sender: true, receiver: true },
    });

    const acceptedFriendIds = friendRequests.map((req) => 
      req.senderId === currentUserId ? req.receiverId : req.senderId
    );

    // 2. Get all people we have exchanged messages with
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
      },
      distinct: ['senderId', 'receiverId'],
      select: { senderId: true, receiverId: true },
    });

    const conversationIds = messages.flatMap(m => [m.senderId, m.receiverId]);
    const uniqueConversationIds = Array.from(new Set(conversationIds)).filter(id => id !== currentUserId);

    // 3. Combine and fetch user details
    const allRelevantIds = Array.from(new Set([...acceptedFriendIds, ...uniqueConversationIds]));

    const users = await prisma.user.findMany({
      where: {
        id: { in: allRelevantIds },
      },
    });

    // 4. Map with isFriend status
    const data = users.map(user => ({
      ...user,
      isFriend: acceptedFriendIds.includes(user.id),
      status: acceptedFriendIds.includes(user.id) ? "Friend" : "Unfriended"
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Friends fetch failed:", error);
    return { success: false, data: [] };
  }
};

export const unfriend = async ({ 
  userId, 
  oppUserId 
}: { 
  userId: string; 
  oppUserId: string; 
}) => {
  try {
    const request = await prisma.friendRequests.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: oppUserId, status: "accepted" },
          { senderId: oppUserId, receiverId: userId, status: "accepted" },
        ],
      },
    });

    if (!request) return { success: false, message: "Friendship not found" };

    await prisma.friendRequests.delete({
      where: { id: request.id },
    });

    revalidatePath("/");
    return { success: true, message: "Unfriended successfully" };
  } catch (error) {
    console.error("Unfriend Error:", error);
    return { success: false, message: "Action failed" };
  }
};

export const updatePic = async ({ userId, fileUrl }: { userId: string, fileUrl: string }) => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { image: fileUrl },
    });
    return { success: true, message: "Profile picture updated" };
  } catch (error) {
    return { success: false, message: "Update failed" };
  }
};

export const updateProfile = async ({ name, bio, userId }: { name: string, bio: string, userId: string }) => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name, bio },
    });
    revalidatePath("/edit");
    return { success: true, message: "Profile updated" };
  } catch (error) {
    return { success: false, message: "Update failed" };
  }
};