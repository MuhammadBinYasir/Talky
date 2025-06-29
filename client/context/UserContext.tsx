"use client";

import { getCurrentUser, getData } from "@/actions/UserActions";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  supabaseId: string;
  name: string;
  email: string;
  image: string;
  bio: string;
};

const UserContext = createContext<{ user: User | null }>({
  user: null,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

   useEffect(() => {
    const fetch = async () => {
      const supabase = await getData();
      if (!supabase?.userId) return;

      const userResult = await getCurrentUser({ supabaseId: supabase.userId });
      if (userResult.success && userResult.data) {
        setUser(userResult.data);
      }
    };

    fetch();
  }, []);

  return (
    <UserContext.Provider value={{user}}>
        {children}
    </UserContext.Provider>
  )
};

export const useUser = () => useContext(UserContext);
