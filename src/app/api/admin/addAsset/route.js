import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import mongoose from "mongoose";
import Lab_PCs from "../../../../models/Lab_PCs";
import Assets from "../../../../models/Asset";
import { generateQRCodeForAsset } from "../../utils/generateQR";
 
export async function POST(req) { 
  try {
    await connectDB();

    const body = await req.json();
    
    const { Asset_Name, Asset_Type, Assest_Status, PC, Lab, Brand } = body;

    if (!Asset_Name || !Asset_Type || !Assest_Status, !PC, !Lab) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingAsset = await Assets.findOne({ Asset_Name: Asset_Name });
    if (existingAsset) {
      return NextResponse.json({ error: "Asset with this ID already exists" }, { status: 409 });
    }

    const newAsset = await Assets.create({
      Asset_Name: Asset_Name,
      Asset_Type: Asset_Type.toLowerCase(),
      Assest_Status: Assest_Status,
      Brand: Brand,
      PC_Name: [new mongoose.Types.ObjectId(PC)],
      Lab_Name: [new mongoose.Types.ObjectId(Lab)],
      QR_Code: "",
    });

    await Lab_PCs.findByIdAndUpdate(PC, {
      $push: { Assets: newAsset._id },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    console.log("Generating QR for:", newAsset._id, "Base:", baseUrl);

    await generateQRCodeForAsset(newAsset._id, baseUrl);

    return NextResponse.json({
      message: "Asset added successfully",
      asset: newAsset,
    });
  } catch (error) {
    console.error("Error adding Asset:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
