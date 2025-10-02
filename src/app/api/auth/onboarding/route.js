// import { NextResponse } from "next/server";
// import { updateUserProfile } from "../../../../models/User.js";
// import { upload } from "../../../../lib/multer.js";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET;

// function runMiddleware(req, fn) {
//   return new Promise((resolve, reject) => {
//     fn(req, {}, (result) => {
//       if (result instanceof Error) return reject(result);
//       return resolve(result);
//     });
//   });
// }

// export async function POST(req) {
//   try {
//     // verify token first
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET);
//     const userId = decoded.userId;

//     // check if avatar URL (JSON body) OR file upload
//     let profileImage;
//     if (req.headers.get("content-type").includes("multipart/form-data")) {
//       // handle multer upload
//       await runMiddleware(req, upload.single("profileImage"));
//       profileImage = `/uploads/${req.file.filename}`;
//     } else {
//       const body = await req.json();
//       profileImage = body.profileImage; // dicebear avatar url
//       const { fullName, phone, location } = body;

//       const updated = await updateUserProfile(userId, {
//         fullName,
//         phone,
//         location,
//         profileImage
//       });

//       return NextResponse.json({ message: "Profile updated", user: updated });
//     }

//     // save user with uploaded image path
//     const updated = await updateUserProfile(userId, {
//       profileImage
//     });

//     return NextResponse.json({ message: "Profile updated", user: updated });

//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }

import { NextResponse } from "next/server";
import { updateUserProfile } from "../../../../models/User.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    // Verify token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    let profileImage;

    // ✅ Check if it's multipart upload
    if (req.headers.get("content-type")?.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("profileImage"); // <-- get file from formData
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
      // ✅ Handle JSON body (dicebear / external URL)
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
