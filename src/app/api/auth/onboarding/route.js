import { NextResponse } from "next/server";
import { updateUserProfile } from "../../../../models/User.js";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route.js";

export async function POST(req) {
  try {
    let userId;

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    userId = session.user.id;

    let profileImage;

    // Check if it's multipart upload
    if (req.headers.get("content-type")?.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("profileImage"); 
      const fullName = formData.get("fullName");
      const phone = formData.get("phone");
      const location = formData.get("location");

      if (file && file.name) {
        const buffer = Buffer.from(await file.arrayBuffer());

        // save to /public/DP_uploads
        const fileName = Date.now() + path.extname(file.name);
        const filePath = path.join(process.cwd(), "public", "DP_uploads", fileName);

        fs.writeFileSync(filePath, buffer);

        profileImage = `/DP_uploads/${fileName}`;
      }

      const updated = await updateUserProfile(userId, {
        fullName,
        phone,
        location,
        profileImage
      });

      return NextResponse.json({ message: "Profile updated", user: updated });
    } else {
      // Handle JSON body (dicebear URL)
      const body = await req.json();
      const { fullName, phone, location, profileImage: avatarUrl } = body;

      const updated = await updateUserProfile(userId, {
        fullName,
        phone,
        location,
        profileImage: avatarUrl
      });

      return NextResponse.json({ message: "Profile updated", user: updated });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
