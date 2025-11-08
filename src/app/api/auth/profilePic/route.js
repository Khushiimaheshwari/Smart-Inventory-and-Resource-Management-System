import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { userProfilePic } from "../../../../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  try {
    let userId;

    const token = req.cookies.get("token")?.value;
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
    }

    if (!userId) {
      const session = await getServerSession(authOptions);
      if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      userId = session.user.id;
    }

    const profileImage = await userProfilePic(userId);

    const finalImage =
      profileImage ||
      "https://api.dicebear.com/7.x/adventurer/svg?seed=default";

    return NextResponse.json({
      success: true,
      profileImage: finalImage,
    });

  } catch (error) {
    console.error("Error fetching profile image:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile image" },
      { status: 500 }
    );
  }
}
