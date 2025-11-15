import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AzureADProvider from "next-auth/providers/azure-ad";
import { connectDB } from "../../utils/db";
import { User } from "../../../../models/User";

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: { params: { scope: "openid profile email User.Read" } },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email || profile.preferred_username,
        };
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { email, password } = credentials;

        await connectDB();
        const user = await User.findOne({ Email: email });

        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) return null;

        return {
          id: user._id.toString(),
          name: user.Name,
          email: user.Email,
          role: user.Role,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // ⭐ Allow Credential logins for ANY user
      if (account.provider !== "azure-ad") {
        return true;
      }

      // ⭐ Restrict Azure AD users to @krmu.edu.in
      if (!user.email?.endsWith("@krmu.edu.in")) {
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
        await connectDB();
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
      session.user.email = token.email;
      session.user.role = token.role;
      session.user.customJWT = token.customJWT;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };