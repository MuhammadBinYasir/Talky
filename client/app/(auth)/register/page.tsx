"use client";
import { createUser, signIn } from "@/actions/UserActions";
import Input from "@/components/Input";
import { AtSign, Lock, User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
  }>({
    name: "",
    email: "",
    password: "",
  });

  const CreateAcc = async () => {
    if (
      formData.email !== "" &&
      formData.password !== "" &&
      formData.name !== ""
    ) {
      const login = await createUser({
        email: formData.email,
        password: formData.password,
        name: formData.name
      });

      if (login.success) {
        toast.success("Account Created Successfully");
        redirect("/");
      } else {
        toast.error(`${login.message}`);
      }
    } else {
      toast.error("All fields are required!");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Create a New Account
      </h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Please enter your credentials below
      </p>
      <div className="w-full h-[1px] bg-neutral-200 my-4"></div>
      <div className="space-y-3">
        <Input
          Icon={User}
          inputProps={{
            value: formData.name,
            onChange: (e) => {
              setFormData({
                ...formData,
                name: e.target.value,
              });
            },
            placeholder: "Enter Name",
            type: "text",
          }}
        />
        <Input
          Icon={AtSign}
          inputProps={{
            value: formData.email,
            onChange: (e) => {
              setFormData({
                ...formData,
                email: e.target.value,
              });
            },
            placeholder: "Enter Email",
            type: "email",
          }}
        />
        <Input
          Icon={Lock}
          inputProps={{
            value: formData.password,
            onChange: (e) => {
              setFormData({
                ...formData,
                password: e.target.value,
              });
            },
            placeholder: "Enter Password",
            type: "password",
          }}
        />
      </div>

      <div className="flex justify-end text-sm text-gray-500 mt-4 items-center w-full">
        <Link href="/login" className="hover:underline">
          Login To Your Account
        </Link>
      </div>

      <div className=" mt-4 w-full justify-end items-end flex">
        <button
          onClick={CreateAcc}
          className="w-full bg-sky-800 hover:bg-sky-900 text-white py-3 rounded-lg transition duration-300 cursor-pointer"
        >
          Register Now
        </button>
      </div>
    </div>
  );
};

export default page;
