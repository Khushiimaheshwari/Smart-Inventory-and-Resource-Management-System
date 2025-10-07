import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import LabTechnician from "../../../../models/Lab_Technician";
import Lab from "../../../../models/Labs";

export async function GET() {
  try {
    await connectDB();

    const technicians = await LabTechnician.find(
      {},
      "_id Name Email ProfileImage PhoneNumber Location AccountStatus Labs"
    ).populate("Labs", "Lab_ID Lab_Name");

    return NextResponse.json({ technicians });
  } catch (error) {
    console.error("Error fetching lab technicians:", error);
    return NextResponse.json(
      { error: "Failed to fetch lab technicians" },
      { status: 500 }
    );
  }
}
