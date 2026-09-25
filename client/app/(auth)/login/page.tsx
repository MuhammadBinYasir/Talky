"use client";
import { signIn } from "@/actions/UserActions";
import Input from "@/components/Input";
import { AtSign, Lock, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const loginNow = async () => {
    if (!formData.email || !formData.password) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const response = await signIn({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        toast.success("Login Success!");
        router.push("/");
      } else {
        toast.error(`${response.message}`);
      }
    } catch (err: any) {
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        Login to Your Account
      </h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Please enter your credentials below
      </p>

      <div className="w-full h-[1px] bg-neutral-200 my-4"></div>
      <div className="space-y-3">
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

      <div className="flex justify-between text-sm text-gray-500 mt-4">
        <Link href="#" className="hover:underline">
          Forgot password?
        </Link>
        <Link href="/register" className="hover:underline">
          Create account
        </Link>
      </div>

      <div className=" mt-4 w-full justify-end items-end flex">
        <button
          onClick={loginNow}
          disabled={loading}
          className="w-full bg-sky-800 hover:bg-sky-900 disabled:bg-sky-950/50 text-white py-3 rounded-lg transition duration-300 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? "Logging in..." : "Login Now"}
        </button>
      </div>
    </div>
  );
};

export default Page;
