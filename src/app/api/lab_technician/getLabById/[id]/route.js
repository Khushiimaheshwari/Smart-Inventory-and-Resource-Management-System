import { NextResponse } from "next/server";
import { connectDB } from "../../../../../app/api/utils/db";
import Lab from "../../../../../models/Labs";
import LabTechnician from "../../../../../models/Lab_Technician";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const lab = await Lab.findById(id).populate("LabTechnician", "Name Email PhoneNumber");

    return NextResponse.json({ lab });
  } catch (error) {
    console.error("Error fetching labs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
