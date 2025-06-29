import { fetchAllUsers } from "@/actions/UserActions";
import Image from "next/image";
import React from "react";
import AvailableUsersCard from "./AvailableUsersCard";

const AvailableUsers = async () => {
  const data = await fetchAllUsers();

  if (!data?.success || data.data.length === 0) {
    return <p className="text-center col-span-4">No users found!</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-4">
      {data.data.map((user, index) => (
        <AvailableUsersCard user={user} key={user.id || index} />
      ))}
    </div>
  );
};

export default AvailableUsers;

