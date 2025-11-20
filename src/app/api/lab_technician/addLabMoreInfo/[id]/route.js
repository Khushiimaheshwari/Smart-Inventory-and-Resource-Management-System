import { NextResponse } from "next/server";
import { connectDB } from "../../../../../app/api/utils/db";
import Lab from "../../../../../models/Labs";
import mongoose from "mongoose";

export async function POST(req, { params }) {
  try {
    await connectDB(); 

    const { id } = params;
    const body = await req.json();
    console.log("Request Body:", body);
    
    const { Hardware_Specifications, Software_Specifications, Device } = body;

    const existingLab = await Lab.findOne({ _id: id });
    if (!existingLab) {
      return NextResponse.json({ error: "Lab with this ID not found" }, { status: 409 });
    }
    
    const labSaved = await Lab.findByIdAndUpdate(
      id,
      {
        $push: {
          Device: {
            Device_Type: Device[0].Device_Type?.toLowerCase() || "",
            Brand: Device[0].Brand || "",
            Serial_No: Device[0].Serial_No || "",
          },
        },
        $set: {
          Hardware_Specifications: Hardware_Specifications || "",
          Software_Specifications: Software_Specifications || "",
        },
      },
      { new: true }
    );

    return NextResponse.json({
      message: "Lab Info added successfully",
      labs: labSaved,
    });
  } catch (error) {
    console.error("Error adding lab info:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
