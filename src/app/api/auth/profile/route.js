import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { authOptions } from "../[...nextauth]/route.js";
import { getServerSession } from "next-auth";
import { userProfile, userProfileByEmail } from "../../../../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  try {
    const token = cookies().get("tokesn")?.value;

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await userProfile(decoded.userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({ user }, { status: 200 });
    }

    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      const user = await userProfileByEmail(session.user.email); 
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ user }, { status: 200 });
    }
    
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}