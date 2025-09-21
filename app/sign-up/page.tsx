"use client"

import AuthForm from '@/components/auth/AuthForm'
import React from 'react'
import Link from 'next/link'

const Signup = () => {
  return (
    <div className="min-h-fit flex items-center justify-center bg-gradient-to-tr from-blue-200 via-white to-purple-200 dark:from-gray-900 dark:via-gray-950 dark:to-black px-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl backdrop-blur-xl">
        
        {/* Left Section */}
        <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-blue-50/70 to-purple-100/70 dark:from-gray-800/70 dark:to-gray-900/70">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white leading-snug">
              Fast, Efficient <br /> and Productive
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg max-w-md">
              Work smarter, not harder. Create your account today and
              streamline your campaigns with ease.
            </p>
          </div>

          <div className="flex items-center justify-between text-sm mt-10">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 dark:text-gray-300">English</span>
            </div>
            <div className="flex gap-4 text-gray-500 dark:text-gray-400">
              <Link href="#" className="hover:text-blue-600">Terms</Link>
              <Link href="#" className="hover:text-blue-600">Plans</Link>
              <Link href="#" className="hover:text-blue-600">Contact Us</Link>
            </div>
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="w-full md:w-1/2 bg-white/80 dark:bg-black/80 flex items-center justify-center backdrop-blur-lg">
          <div className="w-full max-w-md p-4">
            <AuthForm type="signup" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
