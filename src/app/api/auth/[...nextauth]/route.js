import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { connectDB } from "../../utils/db";
import { User } from "../../../../models/User";

export const authOptions = {

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email?.endsWith("@krmu.edu.in")) {
        return false;
      }

      await connectDB();

      let existingUser = await User.findOne({ Email: user.email });

      if (!existingUser) {
        const dummyPassword = await bcrypt.hash("azure-ad-login", 10);

        existingUser = await User.create({
          Name: user.name || "Unknown",
          Email: user.email,
          Password: dummyPassword,
          ProfileImage: user.image || "",
          Role: "faculty",
        });
      }

      return true;

    },
    async jwt({ token, user }) {
        if (user) {
            const dbUser = await User.findOne({ Email: user.email });

            if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.Role;
            token.email = dbUser.Email;   

            token.customJWT = jwt.sign(
                {
                userId: dbUser._id.toString(),
                email: dbUser.Email,      
                role: dbUser.Role,
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
            }
        }

        return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.email = token.email;  
      session.user.customJWT = token.customJWT;
      return session;
    },
  },

  events: {
    async signOut({ token }) {
      token = null; 
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
