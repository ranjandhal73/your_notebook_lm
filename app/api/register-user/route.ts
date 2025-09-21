import { registerUser } from "@/controllers/auth";
import { NextResponse } from "next/server";


export async function POST (req: Request) {
    const {name, email, password, confirmPassword} = await req.json();

    try {
        const result = await registerUser(name, email, password, confirmPassword);

        if(!result || !result.success){
            return NextResponse.json(
                {success: false, message: result?.message || "Registration failed. Please try again later."},
                {status: 400}
            )
        }

        if(result.success){
            return NextResponse.json(
                {success: true, message: result?.message},
                {status: 200}
            )
        }
    } catch (error: unknown) {
        return NextResponse.json(
            {sucess: false, message: (error as Error)?.message},
            {status: 400}
        )
    }
}