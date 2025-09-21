"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import OtpInput from "react-otp-input";
import Link from "next/link";
import { verifyUserEmailHandler } from "@/apiServices/authService";


const VerifyEmailForm = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useSelector((state: RootState) => state.auth);

  console.log("User inside verifyuser email", user)
  useEffect(() => {
    if (!user) {
      router.push("/signup");
    }
  }, [user, router]);

  const handleChange = (otp: string) => {
    setOtp(otp);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if(!user) return;
      const result = await verifyUserEmailHandler(user, otp);

      console.log("Results inside verifyUserEmailHandler:", result)
      if (result.success) {
        toast.success(result?.message || "OTP verified!");
        setOtp("");
        router.replace("/");
      } else {
        toast.error(result.message || "Verification failed!");
      }
    } catch (error: unknown) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Verification Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] text-white px-4">
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center mb-2">
          Verify Your Email
        </h2>

        <form onSubmit={onSubmit} className="space-y-5 text-center">
          <p className="text-gray-400 text-sm mb-4">
            {user! && (
              <span>
                Hello <strong className="text-[#00FFD5]">{user?.name}</strong>, we’ve sent a verification code to your
                email: <strong className="text-[#00FFD5]">{user?.email}</strong>
              </span>
            )}
            <br />
            Please enter the 8-digit code below to verify your email and
            complete the registration process.
          </p>

          <OtpInput
            value={otp}
            onChange={handleChange}
            numInputs={8}
            renderInput={(props) => <input {...props} />}
            containerStyle="flex justify-between gap-2"
            inputStyle={{
              width: "3rem",
              height: "3rem",
              borderRadius: "0.5rem",
              fontSize: "1.5rem",
              border: "1px solid #ccc",
              background: "#2a2a2a",
              color: "#fff",
              textAlign: "center",
            }}
          />

          <button
            type="submit"
            className={`w-full py-2 rounded-md font-semibold transition mt-6 cursor-pointer 
              ${loading ? "bg-gray-500 text-white cursor-not-allowed" : "bg-[#00FFD5] text-black hover:bg-[#00e6c0]"}`}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-4 text-center">
          Back to signup page?{" "}
          <Link
            href="/sign-up"
            className="text-[#00FFD5] hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailForm;
