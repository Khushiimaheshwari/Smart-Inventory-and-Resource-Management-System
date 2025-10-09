import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import PCs from "../../../../models/Lab_PCs";

export async function GET() {
  try {
    await connectDB();
 
    const pcs = await PCs.find(
      {},
      "_id PC_Name Lab Assets"
    ).populate("Lab", "Lab_ID");

    return NextResponse.json({ pcs });
  } catch (error) {
    console.error("Error fetching PCs:", error);
    return NextResponse.json(
      { error: "Failed to PCs" },
      { status: 500 }
    );
  }
}
