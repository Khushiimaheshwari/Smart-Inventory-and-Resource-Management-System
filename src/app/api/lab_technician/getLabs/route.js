import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Lab from "../../../../models/Labs";
import LabTechnician from "../../../../models/Lab_Technician";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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

    const labs = await Lab.find({ _id: { $in: technician.Labs } })
      .populate("LabTechnician", "Name Email");
      // .populate("Lab_Incharge", "Name Email");

    return NextResponse.json({ labs });
  } catch (error) {
    console.error("Error fetching labs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
