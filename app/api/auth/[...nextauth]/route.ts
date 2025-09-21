import { authOption } from "@/lib/authOption";
import NextAuth from "next-auth";

const handel = NextAuth(authOption)

export {handel as GET, handel as POST}