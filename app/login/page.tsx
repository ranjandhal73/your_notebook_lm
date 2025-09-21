"use client";

import AuthForm from "@/components/auth/AuthForm";
import React, { useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Login = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();

  useEffect(() => {
    if (user || isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [user, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <div className="flex flex-col md:flex-row w-full max-w-6xl shadow-xl rounded-3xl overflow-hidden border dark:border-gray-800">
        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-between w-1/2 p-10 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-800 dark:to-gray-900">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Fast, Efficient and Productive
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt.
            </p>
          </div>

          <div className="flex items-center justify-between text-sm mt-8">
            <div className="flex items-center gap-2">
              <Image
                src="/icons/usa.svg"
                alt="English"
                className="rounded-full"
                width={100}
                height={100}
              />
              <span className="text-gray-700 dark:text-gray-300">English</span>
            </div>
            <div className="flex gap-4 text-gray-500 dark:text-gray-400">
              <Link href="#">Terms</Link>
              <Link href="#">Plans</Link>
              <Link href="#">Contact Us</Link>
            </div>
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="w-full md:w-1/2 bg-white dark:bg-black flex items-center justify-center">
          <div className="w-full max-w-md p-5">
            <AuthForm type="login" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
