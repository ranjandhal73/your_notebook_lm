import dbConnect from "@/config/dbConnect";
import { OTP } from "@/models/otpSchema";
import { User } from "@/models/userSchema";
import { generateOTP } from "@/utils/generateOTP";
import { registrationEmailTemplate } from "@/utils/emails/registrationEmailTemplate"
import mongoose, {Types} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendEmail } from "@/utils/sendEmail";
import { welcomeEmailTemplate } from "@/utils/emails/welcomeEmailTemplate";



interface RegisterUserData {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}

export const registerUser = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
) => {
    if(!name || !email || !password || !confirmPassword){
        return { success: false, message: "All fields are required." };
    }
    if(password !== confirmPassword){
        return { success: false, message: "Passwords do not match." };
    }

    await dbConnect();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const existingUser = await User.findOne({ email }).session(session);
        if(existingUser){
            await session.abortTransaction();
            return {
                success: true,
                message: "If this email is not registered, we'll send you a verification email shortly.",
            }
        }

        const otpCode = generateOTP();
        console.log(`otpCode is: ${otpCode}`)
        const otpDoc = new OTP({
            email,
            verifyCode: otpCode,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        })

        await otpDoc.save({session});

        await sendEmail(
          email,
          "Your verification code",
          registrationEmailTemplate(otpCode, name)
        );
        await session.commitTransaction();

        return {
          success: true,
          message: "OTP sent to your email if it's valid.",
        };

    } catch (error) {
        await session.abortTransaction();
        console.error("Registration error:", error);
        return {
            success: false,
            message: "Failed to send OTP. Please try again later."
        }
    } finally {
        await session.endSession();
    }
}

export const verifyAndCreateUser = async (
  name: string,
  email: string,
  password: string,
  otp: string
) => {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const otpDoc = await OTP.findOne({ email, isUsed: false })
      .sort({ createdAt: -1 })
      .session(session);

      console.log("Otp docs is:", otpDoc.verifyCode, "And otp is:", otp);
      console.log("Type of otpdoc is:", typeof(otpDoc.verifyCode), "And type of OTP is:", typeof(otp))
    if (!otpDoc || otpDoc.verifyCode !== otp) {
      await session.abortTransaction();
      return { success: false, message: "Invalid OTP." };
    }

    if (otpDoc.expiresAt < new Date()) {
      await session.abortTransaction();
      return { success: false, message: "OTP has expired." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    await newUser.save({ session });

    otpDoc.user = newUser._id as Types.ObjectId;
    otpDoc.isUsed = true;
    await otpDoc.save({ session });

    await session.commitTransaction();

    // Send welcome email asynchronously
    sendEmail(email, "Welcome 🎉", welcomeEmailTemplate(name)).catch(console.error);

    return {
      success: true,
      message: "Account verified and created successfully.",
    };
  } catch (error) {
    await session.abortTransaction();
    console.error("Verification error:", error);
    return {
      success: false,
      message: "Something went wrong during verification.",
    };
  } finally {
    await session.endSession();
  }
};

export const loginUser = async (email: string, password: string) => {
  await dbConnect();

  if (!email || !password) {
    return { success: false, message: "Email and password are required." };
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findOne({ email }).session(session);
    if (!user) {
      await session.abortTransaction();
      return { success: false, message: "Invalid credentials." };
    }

    if (!user.isVerified) {
      await session.abortTransaction();
      return {
        success: false,
        message: "Please verify your email before logging in.",
      };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      await session.abortTransaction();
      return { success: false, message: "Invalid credentials." };
    }

    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"],
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET!, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES as jwt.SignOptions["expiresIn"],
    });

    user.refreshToken = refreshToken;
    await user.save({ session });
    await session.commitTransaction();

    return {
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
    };
  } catch (error) {
    await session.abortTransaction();
    console.error("Login error:", error);
    return {
      success: false,
      message: "Internal error during login.",
    };
  } finally {
    await session.endSession();
  }
};