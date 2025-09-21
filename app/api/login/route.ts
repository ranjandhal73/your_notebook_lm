import { loginUser } from "@/controllers/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    const result = await loginUser(email, password);

    if (!result || result.success === false) {
      return NextResponse.json(
        { success: false, message: result?.message || "Login failed" },
        { status: 400 }
      );
    }

    if(result.accessToken && result.refreshToken){
        const {accessToken, refreshToken} = result;

        const response = NextResponse.json(
            { message: "Login successful", success: true},
            { status: 200}
        );

        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 15
        })

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 15
        })

        return response;
    }
  } catch (error: unknown) {
    return NextResponse.json(
        { message: (error as Error)?.message, success: false }, 
        { status: 400 }
    );
  }
}
