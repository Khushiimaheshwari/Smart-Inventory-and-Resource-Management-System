import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Lab from "../../../../models/Labs";
import LabTechnician from "../../../../models/Lab_Technician";
import Faculty from "../../../../models/Faculty";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectDB(); 

    const body = await req.json();
    console.log(body);
    
    const { labId, labName, block, labRoom, capacity, status, incharge, technician } = body;

    if (!labId || !labName || !block || !labRoom) {
      return NextResponse.json({ error: "Lab ID, Name, Incharge, Block and LabRoom are required" }, { status: 400 });
    }

    const existingLab = await Lab.findOne({ Lab_ID: labId });
    if (existingLab) {
      return NextResponse.json({ error: "Lab with this ID already exists" }, { status: 409 });
    }

    const technicianIds = technician && technician.trim() !== ""
      ? [new mongoose.Types.ObjectId(technician)]
      : [];

    const inchargeIds = incharge && incharge.trim() !== ""
      ? [new mongoose.Types.ObjectId(incharge)]
      : [];

    const newLab = await Lab.create({
      Lab_ID: labId,
      Lab_Name: labName,
      Block: block || "",
      Lab_Room: labRoom || "",
      Total_Capacity: capacity || 0,
      Status: status?.toLowerCase() === "active" ? "active" : "inactive",
      LabTechnician: technicianIds, 
      Lab_Incharge: inchargeIds,
      Remarks: "",
      PCs: [],
      Hardware_Specifications: "",
      Software_Specifications: "",
    });

    if(technician && technician.trim() !== "") {
      await LabTechnician.findByIdAndUpdate(technician, {
        $push: { Labs: newLab._id },
      });
    }

    if(incharge && incharge.trim() !== "") {
      await Faculty.findByIdAndUpdate(incharge, {
        $push: { Labs: newLab._id },
      });
    }

    return NextResponse.json({
      message: "Lab added successfully",
      labs: newLab,
    });
  } catch (error) {
    console.error("Error adding lab:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
