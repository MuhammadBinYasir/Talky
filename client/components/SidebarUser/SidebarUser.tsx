"use client";
import { friends } from "@/actions/UserActions";
import React, { useEffect, useState } from "react";
import SidebarUserCard from "./SidebarUserCard";
import toast from "react-hot-toast";
import SidebarUserLoading from "./SidebarUserLoading";
import NoFriend from "../Errors/NoFriend";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await friends();
        if (response?.success) {
          setUsers(response.data);
        } else {
          // No need for toast here as we'll show NoFriend component if empty
          setUsers([]);
        }
      } catch (err) {
        toast.error("Contact sync failed");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [pathname]); // Refresh list when navigating between screens

  return (
    <>
      {loading ? (
        <SidebarUserLoading />
      ) : users.length === 0 ? (
        <NoFriend />
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
