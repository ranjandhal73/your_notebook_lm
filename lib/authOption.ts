
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { User } from "@/models/userSchema";
import dbConnect from "@/config/dbConnect";

export const authOption: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await dbConnect();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // New User → Save in DB
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          isVerified: true,
          providers: [
            {
              provider: account?.provider,
              providerId: account?.providerAccountId,
            },
          ],
        });
      } else {
        // Existing user → add provider if not already added
        const hasProvider = existingUser.providers.some(
          (p: any) => p.provider === account?.providerAccountId
        );
        console.log("hasProvider is:", hasProvider)
        if (!hasProvider) {
          existingUser.providers.push({
            provider: account?.provider!,
            providerId: account?.providerAccountId!,
          });
          await existingUser.save();
        }
      }
      return true; // allow login
    },
    async session({ session, token }) {
      console.log("Session inside authOption:", session)
      // Attach DB user ID to session
      const dbUser = await User.findOne({ email: session.user?.email });
      if (dbUser && session.user) {
        (session.user as any).id = dbUser._id.toString();
        session.user = {
          email: dbUser.email,
          name: dbUser.name
        };
      }
      return session;
    },
  },
};