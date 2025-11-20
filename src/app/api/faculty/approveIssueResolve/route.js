import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Assets from "../../../../models/Asset";
import Faculty from "../../../../models/Faculty";
import { User } from "../../../../models/User";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { assetId, issueId } = body;

    if ( !assetId || !issueId ) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const updatedAsset = await Assets.findByIdAndUpdate(
      assetId,
      {
        $set: {
          "Issue_Reported.$[elem].Status": "approved",
        },
      },
      {
        new: true,
        arrayFilters: [
          { "elem._id": issueId }   
        ],
      }
    ).populate("Issue_Reported.FacultyDetails", "Name Email");

    if (!updatedAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Issue approved successfully",
        asset: updatedAsset,
      },
    );

  } catch (error) {
    console.error("Error adding lab:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
