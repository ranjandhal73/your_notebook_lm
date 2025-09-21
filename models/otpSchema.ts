import mongoose, {Document, Schema, Types} from "mongoose";

export interface IOtp extends Document {
    verifyCode: string;
    email: string;
    expiresAt: Date;
    isUsed: boolean;
    user?: Types.ObjectId;
}

const otpSchema: Schema<IOtp> = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    verifyCode: {
        type: String,
        required: [true, "OTP is required"]
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        expires: 600 // 10 minutes,
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    user: {
        type: Types.ObjectId,
        ref: "User",
    }
},{timestamps: true})

export const OTP = mongoose.models.OTP || mongoose.model<IOtp>("OTP",otpSchema);