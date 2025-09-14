import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { userProfile } from "../../../../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  try {
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await userProfile(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}