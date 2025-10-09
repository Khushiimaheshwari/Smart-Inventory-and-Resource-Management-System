import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Lab from "../../../../models/Labs";

export async function GET() {
  try {
    await connectDB();

    const labs = await Lab.find({}, "_id Lab_ID Lab_Name Block Lab_Room Total_Capacity Status LabTechnician Lab_Incharge Equipment").populate("LabTechnician", "Name"); 
    // const labs = await Lab.find({}, "_id Lab_ID Lab_Name Block Lab_Room Total_Capacity Status Lab_Technician Lab_Incharge Equipment").populate("Lab_Technician", "Name").populate("User", "Name"); 

    return NextResponse.json({ labs });
  } catch (error) {
    console.error("Error fetching labs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
