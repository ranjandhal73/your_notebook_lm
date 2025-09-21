import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import dbConnect from "@/config/dbConnect";
import { User } from "@/models/userSchema";

export async function POST (req: NextRequest){
    try {
        const { refreshToken } = await req.json();

        if(!refreshToken){
            return NextResponse.json(
                { success: false, error: "Token is required"},
                { status: 400}
            );
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as JwtPayload;
        await dbConnect();
        const user = await User.findById(decoded.id);

        if(!user || user.refreshToken !== refreshToken){
            return NextResponse.json(
                { success: false, error: "Invalid refresh token" },
                { status: 401 }
            )
        }

        const payload = {
            id: user._id,
            name: user.name,
            date: Date.now()
        };

        const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: "15m"
        });

        const newRefreshToken = jwt.sign(payload, process.env.REFRESH_SECRET!, {
            expiresIn: "7d",
        })

        user.refreshToken = newRefreshToken;
        await user.save();

        return NextResponse.json({
            success: true,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.error("Token refresh error:", error);
        return NextResponse.json(
            {success: false, error: "Invalid token"},
            {status: 401}
        )
    }
}