import { NextResponse } from "next/server";
import dbConnect from "@/config/dbConnect";
import { User } from "@/models/userSchema";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET(req: Request) {
    try {
        
        const accessToken = req.headers.get("cookie")
        ?.split("; ")
        .find((c)=>c.startsWith("accessToken="))
        ?.split("=")[1];

        if(!accessToken){
            return NextResponse.json(
                {success: false, message: "Login expired! Please login again."},
                {status: 401}
            );
        }
        
        await dbConnect();
        let decoded: any
        try {
            decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as JwtPayload;
        } catch (error: unknown) {
            return NextResponse.json(
                {success: false, message: "Invalid or expired token"},
                {status: 401}
            )
        }
        
        const user = await User.findById(decoded.id).select("name email -_id");
        if(!user){
            return NextResponse.json(
                {success: false, message: "User not found"},
                { status: 404}
            )
        }

        return NextResponse.json(
            {success: true, user}
        )
    } catch (error: unknown) {
        console.error("ME route error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error"},
            {status: 500}
        )
    }
}