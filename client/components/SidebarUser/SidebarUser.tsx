"use client";
import { friends } from "@/actions/UserActions";
import React, { useEffect, useState } from "react";
import SidebarUserCard from "./SidebarUserCard";
import toast from "react-hot-toast";
import SidebarUserLoading from "./SidebarUserLoading";

const SidebarUser = () => {
  const [users, setUsers] = useState<
    {
      id: string;
      createdAt: Date;
      supabaseId: string;
      name: string;
      email: string;
      image: string;
      bio: string;
      updatedAt: Date;
    }[]
  >([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const response = await friends();
      if (response?.success) {
        setUsers(response.data);
      } else {
        toast.error("No friends found");
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <>
      {loading ? (
        <>
          <SidebarUserLoading />
        </>
      ) : (
        <div className="space-y-1">
          {users.map((user, index) => (
            <SidebarUserCard key={index} user={user} />
          ))}
        </div>
      )}
    </>
  );
};

export default SidebarUser;
