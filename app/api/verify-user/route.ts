import { verifyAndCreateUser } from "@/controllers/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const {name, email, password, otp} = body;
    console.log("Req.json inside verify user:", body)
    try {
        const result = await verifyAndCreateUser(name, email, password,otp);

        if(!result || !result.success){
            return NextResponse.json(
                {success: false, message: result?.message},
                {status: 400}
            )
        }

        return NextResponse.json(
            {success: true, message: result?.message},
            {status: 200}
        )
    } catch (error: unknown) {
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
} 