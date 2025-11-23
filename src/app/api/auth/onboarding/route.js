import { NextResponse } from "next/server";
import { updateUserProfile } from "../../../../models/User.js";
import fs from "fs";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route.js";
import Faculty from "../../../../models/Faculty.js";
import LabTechnician from "../../../../models/Lab_Technician.js";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const email = session.user.email;
    const role = session.user.role;

    let profileImage;
    let fullName;
    let phone;
    let location;

    if (req.headers.get("content-type")?.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("profileImage");

      fullName = formData.get("fullName");
      phone = formData.get("phone");
      location = formData.get("location");

      if (file && file.name) {
        const buffer = Buffer.from(await file.arrayBuffer());

        const fileName = Date.now() + path.extname(file.name);
        const filePath = path.join(process.cwd(), "public", "DP_uploads", fileName);

        fs.writeFileSync(filePath, buffer);

        profileImage = `/DP_uploads/${fileName}`;
      }

    } else {
      const body = await req.json();
      fullName = body.fullName;
      phone = body.phone;
      location = body.location;
      profileImage = body.profileImage;
    }

    const updateFields = {
      ...(fullName && { Name: fullName }),
      ...(phone && { Phone: phone }),
      ...(location && { Location: location }),
      ...(profileImage && { ProfileImage: profileImage }),
    };

    await updateUserProfile(userId, {
      fullName,
      phone,
      location,
      profileImage,
    });

    if (role === "faculty") {
      await Faculty.findOneAndUpdate(
        { Email: email },
        updateFields,
        { new: true }
      );
    }

    if (role === "lab_technician") {
      await LabTechnician.findOneAndUpdate(
        { Email: email },
        updateFields,
        { new: true }
      );
    }

    return NextResponse.json({
      message: "Profile updated successfully",
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}