"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { loginHandler, sendRegistrationOtp } from '@/apiServices/authService'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'

type AuthFormProps = {
    type: "login" | "signup"
}

interface IUserData {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}
const AuthForm = ({type}:AuthFormProps) => {
    const {register, handleSubmit, reset, formState: {errors, isSubmitting}, watch} = useForm<IUserData>();
    const router = useRouter();
    const dispatch = useDispatch();

    const registartionHandler = async (data: IUserData) =>{
      console.log("Type inside registration handler:", type);
      if(type === "signup"){
          const result = await sendRegistrationOtp(data, dispatch);
          if(result?.success){
            toast.success(result?.message);
            reset();
            router.replace("/verify-email")
          } else{
            toast.error(result?.message || "Signup failed")
          }
        }else if(type === "login"){
          console.log("Entering into login handler....", data)
          const result = await loginHandler(data, dispatch);
          console.log("Result of:", result);
          if(result?.success){
            toast.success(result?.message);
            reset();
            router.replace("/dashboard")
          } else {
            toast.error(result?.message || "Login failed! Please try again later.")
          }
        }
    }
  return (
    <div className="w-full max-w-md mx-auto mt-28 px-4 sm:px-6 lg:px-8 ">
      <div className="rounded-2xl p-6 sm:p-8 space-y-6 border dark:border-gray-800 shadow-lg dark:shadow-xs shadow-gray-600 dark:shadow-blue-400">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          {type === "login" ? "Login" : "Sign Up"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit(registartionHandler)}>
          {type === "signup" && (
            <div>
              <Input
                id="name"
                placeholder="Full Name"
                type="text"
                className="border border-gray-500 rounded-[10px] dark:border-gray-800 placeholder:opacity-50 dark:focus:border-blue-400 focus:border-black"
                disabled={isSubmitting}
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
          )}

          <div>
            <Input
              id="email"
              placeholder="Email"
              type="email"
              className='border-gray-500 rounded-[10px] dark:border-gray-800 placeholder:opacity-50 dark:focus:border-blue-400 focus:border-black'
              disabled={isSubmitting}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              className='border-gray-500 rounded-[10px] dark:border-gray-800 placeholder:opacity-50 dark:focus:border-blue-400 focus:border-black'
              disabled={isSubmitting}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {type === "signup" && (
            <div>
              <Input
                id="confirmPassword"
                placeholder="Confirm Password"
                type="password"
                className='border-gray-500 rounded-[10px] dark:border-gray-800 placeholder:opacity-50 dark:focus:border-blue-400 focus:border-black'
                disabled={isSubmitting}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full cursor-pointer hover:dark:border-blue-400 hover:border-black px-4 py-2 border border-gray-500 rounded-[10px] dark:border-gray-800" 
            disabled={isSubmitting}
          >
            {isSubmitting
              ? type === "signup"
                ? "Creating account..."
                : "Logging in..."
              : type === "signup"
              ? "Sign Up"
              : "Login"}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          or continue with
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-2">
          <button
            onClick={() => signIn("google", {callbackUrl: "/dashboard"})}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-500 rounded-[10px] dark:border-gray-800 cursor-pointer"
          >
            <img src="/icons/google.svg" alt="Google logo" className="w-5 h-5" />
            Google
          </button>
          {/* <button
            onClick={() => signIn("github")}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md shadow-md transition w-full sm:w-auto"
          >
            <img src="/icons/github.svg" alt="GitHub logo" className="w-5 h-5 invert" />
            GitHub
          </button> */}
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          {type === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                href="/"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthForm