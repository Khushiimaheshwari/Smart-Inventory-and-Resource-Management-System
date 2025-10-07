import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Lab from "../../../../models/Labs";
import LabTechnician from "../../../../models/Lab_Technician";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { labId, labName, location, capacity, status, incharge } = body;

    if (!labId || !labName || !incharge) {
      return NextResponse.json({ error: "Lab ID, Name and Incharge are required" }, { status: 400 });
    }

    const existingLab = await Lab.findOne({ Lab_ID: labId });
    if (existingLab) {
      return NextResponse.json({ error: "Lab with this ID already exists" }, { status: 409 });
    }

    const newLab = await Lab.create({
      Lab_ID: labId,
      Lab_Name: labName,
      Location: location || "",
      Total_Capacity: capacity || 0,
      Status: status?.toLowerCase() === "active" ? "active" : "inactive",
      Lab_Incharge: incharge, 
      Remarks: "",
      PCs: [],
      Hardware_Specifications: "",
      Software_Specifications: "",
    });

    await LabTechnician.findByIdAndUpdate(incharge, {
      $push: { Labs: newLab._id },
    });

    return NextResponse.json({
      message: "Lab added successfully",
      lab: newLab,
    });
  } catch (error) {
    console.error("Error adding lab:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
