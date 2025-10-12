import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import PCs from "../../../../models/Lab_PCs";
import Lab from "../../../../models/Labs";
import LabTechnician from "../../../../models/Lab_Technician";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// export async function GET() {
//   try {
//     await connectDB();
 
//     const pcs = await PCs.find(
//       {},
//       "_id PC_Name Lab Assets"
//     ).populate("Lab", "Lab_ID");

//     return NextResponse.json({ pcs });
//   } catch (error) {
//     console.error("Error fetching PCs:", error);
//     return NextResponse.json(
//       { error: "Failed to PCs" },
//       { status: 500 }
//     );
//   }
// }

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  try {
    await connectDB();

    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { email, role } = decoded;

    if (role !== "lab_technician") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const technician = await LabTechnician.findOne({ Email: email }).populate("Labs");
    if (!technician) {
      return NextResponse.json({ error: "Technician not found" }, { status: 404 });
    }

    const labIds = technician.Labs.map(lab => lab._id);

    const pcs = await PCs.find(
      { Lab: { $in: labIds } },
      "_id PC_Name Lab Assets"
    ).populate("Lab", "Lab_ID Lab_Name");

    return NextResponse.json({ pcs });
  } catch (error) {
    console.error("Error fetching PCs:", error);
    return NextResponse.json({ error: "Failed to fetch PCs" }, { status: 500 });
  }
}