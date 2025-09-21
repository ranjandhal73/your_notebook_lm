"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "@/slice/authSlice";
import { fetchCurrentUser } from "@/apiServices/authService";

export const useAuthSync = () => {
  const { data: session, status, update } = useSession();

  console.log("Data inside authSync", status)
  const dispatch = useDispatch();

  useEffect(() => {
    const syncUser = async () => {
      if (status === "authenticated" && session?.user) {
        dispatch(
          loginSuccess({
            email: session?.user?.email!,
            name: session?.user?.name || "",
          })
        );
      } else if (status === "unauthenticated") {
        await fetchCurrentUser(dispatch);
      }
    };
    syncUser();
  }, [session, status, dispatch]);
};
