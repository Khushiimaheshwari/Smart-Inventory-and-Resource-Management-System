import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Lab from "../../../../models/Labs";
import LabTechnician from "../../../../models/Lab_Technician";

export async function GET() {
  try {
    await connectDB();

    const labs = await Lab.find({}, "_id Lab_ID Lab_Name Block Lab_Room Total_Capacity Status LabTechnician Lab_Incharge Equipment").populate("LabTechnician", "Name")

    return NextResponse.json({ labs });
  } catch (error) {
    console.error("Error fetching labs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
