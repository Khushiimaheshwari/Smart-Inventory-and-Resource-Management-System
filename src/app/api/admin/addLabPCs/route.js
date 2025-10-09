import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Lab from "../../../../models/Labs";
import PCs from "../../../../models/Lab_PCs";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { PC_Name, Lab,} = body;

    if (!PC_Name || !Lab) {
      return NextResponse.json({ error: "PC_Name and Lab are required" }, { status: 400 });
    }

    const existingLab = await PCs.findOne({ PC_Name: PC_Name, Lab: Lab });
    if (existingLab) {
      return NextResponse.json({ error: `A PC named "${PC_Name}" already exists in this Lab.` }, { status: 409 });
    }

    const newPC = await PCs.create({
      PC_Name: PC_Name,
      Lab: Lab,          // Should be ObjectId
    });

    await Lab.findByIdAndUpdate(PCs, {
      $push: { PC: newPC._id },
    });

    return NextResponse.json({
      message: "PC added successfully",
      PC: newPC,
    });
  } catch (error) {
    console.error("Error adding lab:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
