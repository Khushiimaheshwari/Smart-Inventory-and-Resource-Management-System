import { NextResponse } from "next/server";
import { connectDB } from "../../../../../app/api/utils/db";
import Labs from "../../../../../models/Labs";
import Assets from "../../../../../models/Asset";
import PCs from "../../../../../models/Lab_PCs";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const pc = await PCs.findById(id)
      .populate("Lab", "Lab_ID")
      .populate({
        path: "Assets",
        populate: {
          path: "Issue_Reported.FacultyDetails",
          select: "Name Email _id"
        }
      });

    if (!pc) {
      return NextResponse.json({ error: "Lab PC not found" }, { status: 404 });
    }

    return NextResponse.json({ pc: pc });
    
  } catch (error) {
    console.error("Error fetching PC", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
