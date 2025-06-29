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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      await prisma.$disconnect();
      return {
        success: false,
        message: error.message,
      };
    }

    if (data?.user) {
      await prisma.user.create({
        data: {
          name,
          email,
          supabaseId: data.user.id,
        },
      });
    }

    await prisma.$disconnect();
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    await prisma.$disconnect();
    return {
      success: false,
      message: error.message || "An unknown error occurred",
    };
  }
};

// ✅ Sign In
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

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    data,
  };
};

// ✅ Sign Out
export const logOut = async () => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
  };
};

export const getData = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user) {
    if (user.email_confirmed_at) {
      console.log("✅ Email is verified");
      return {
        success: true,
        userId: user.id,
      };
    } else {
      console.log("❌ Email is NOT verified");
      return {
        success: false,
        error: "Email Not Verified",
      };
    }
  }
};

export const fetchAllUsers = async () => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "No Supabase user found",
        data: [],
      };
    }

    console.log("Supabase User ID:", user.id);

    const currentUser = await getCurrentUser({ supabaseId: user.id });

    if (!currentUser?.userId) {
      return {
        success: false,
        message: "No current user found in database",
        data: [],
      };
    }

    console.log("MongoDB User ID:", currentUser.userId);

    const userId = currentUser.userId;

    const friend = await friends();

    if (!friend?.success) {
      return {
        success: false,
        message: "No friend data found",
        data: [],
      };
    }
    console.log("Friends data:", friend.data);

    const friendIds = friend.data.map((req: any) => req.id);

    console.log("Friend IDs:", friendIds);

    const users = await prisma.user.findMany({
      where: {
        id: {
          notIn: [userId, ...friendIds],
        },
      },
    });

    return {
      success: users.length > 0,
      message:
        users.length > 0 ? "Users fetched successfully" : "No users found",
      data: users,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Unknown error occurred",
      data: [],
    };
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
    // const f1 = await prisma.user.update({
    //   where: {
    //     id: oppUserId,
    //   },
    //   data: {
    //     requests: {
    //       push: userId,
    //     },
    //   },
    // });

    // const f2 = await prisma.user.update({
    //   where: {
    //     id: userId,
    //   },
    //   data: {
    //     requested: {
    //       push: oppUserId,
    //     },
    //   },
    // });

    const createRequest = await prisma.friendRequests.create({
      data: {
        senderId: userId,
        receiverId: oppUserId,
      },
    });

    if (createRequest) {
      await prisma.$disconnect();

      return {
        success: true,
        message: "Request Sent Successfully",
      };
    } else {
      await prisma.$disconnect();

      return {
        success: false,
        message: "Failed to send request",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error,
    };
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
    const data = await prisma.user.findUnique({
      where: supabaseId ? { supabaseId: supabaseId } : { id: userId },
    });

    if (data) {
      return {
        success: true,
        userId: data.id,
        data,
      };
    } else {
      return {
        success: false,
        message: "User not found",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Unknown error occurred",
    };
  }
};

export const friendsRequests = async ({ userId }: { userId: string }) => {
  try {
    const requests = await prisma.friendRequests.findMany({
      where: {
        receiverId: userId,
        status: "pending",
      },
      include: {
        sender: true,
      },
    });

    if (requests.length > 0) {
      return {
        success: true,
        data: requests,
      };
    } else {
      return {
        success: false,
        message: "No Friend Request",
        data: [],
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};

export const AcceptRejectRequest = async ({
  id,
  type,
}: {
  id: string;
  type: string;
}) => {
  try {
    const update = await prisma.friendRequests.update({
      where: {
        id: id,
      },
      data: {
        status: type,
      },
    });

    if (update) {
      revalidatePath("/users/requests");
      return {
        success: true,
        message: `successfully`,
      };
    } else {
      return {
        success: false,
        message: `Error`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};

export const friends = async () => {
  try {
    const supabaseData = (await getData())?.userId;
    if (!supabaseData) return;

    const userId = await getCurrentUser({ supabaseId: supabaseData });

    const fetchFriends = await prisma.friendRequests.findMany({
      where: {
        OR: [{ senderId: userId.userId }, { receiverId: userId.userId }],
        status: "accepted",
      },
      include: {
        sender: true,
        receiver: true,
      },
    });
    const Users = fetchFriends.map((req) => {
      return req.senderId === userId.userId ? req.receiver : req.sender;
    });

    if (fetchFriends) {
      return {
        success: true,
        data: Users,
      };
    } else {
      return {
        success: false,
        message: "No friends found",
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

export const updatePic = async ({
  userId,
  fileUrl,
}: {
  userId: string;
  fileUrl: string;
}) => {
  try {
    const updatePic = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        image: fileUrl,
      },
    });
    if (updatePic) {
      return {
        success: true,
        message: "Updates Successfully",
      };
    } else {
      return {
        success: false,
        message: "Something went wrong",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};

export const updateProfile = async ({
  name,
  bio,
  userId,
}: {
  name: string;
  bio: string;
  userId: string;
}) => {
  try {
    const update = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        bio,
      },
    });

    if (update) {
      revalidatePath("/edit");
      return {
        success: true,
        message: "Profile Updates Successfully!",
      };
    } else {
      return {
        success: false,
        message: "Something went wrong while updating profile",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};