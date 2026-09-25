import { fetchAllUsers } from "@/actions/UserActions";
import Image from "next/image";
import React from "react";
import AvailableUsersCard from "./AvailableUsersCard";

const AvailableUsers = async () => {
  const data = await fetchAllUsers();

  if (!data?.success || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-dashed border-slate-200 mt-8">
        <p className="text-slate-400 font-bold text-lg mb-1">No explorers discovered yet</p>
        <p className="text-slate-400 text-sm font-medium">Try checking back later or inviting friends!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-8 gap-6 pb-20">
      {data.data.map((user, index) => (
        <AvailableUsersCard user={user} key={user.id || index} />
      ))}
    </div>
  );
};

export default AvailableUsers;

