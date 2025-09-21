import mongoose, {Schema, Document} from "mongoose";
import { Provider } from "react-redux";

interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    isVerified: boolean;
    refreshToken?: string;
    providers: Array<{
        provider: string;
        providerId: string;
    }>;
    image?: string;
    emailVerified?: Date;
}

const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: true,
        minLength: [2, "Name must be at leats 3 characters long"],
        trim: true
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: function(){
            return !this.providers || this.providers.length === 0;
        },
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String
    },
    providers: [{
        provider: {
            type: String,
            required: true
        },
        providerId: {
            type: String,
            required: true
        }
    }],
    image: {
        type: String,
    },
    emailVerified: {
        type: Date,
    }
}, {timestamps: true});

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

