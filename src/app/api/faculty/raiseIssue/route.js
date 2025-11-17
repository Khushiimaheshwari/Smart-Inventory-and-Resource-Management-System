import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Assets from "../../../../models/Asset";
import Faculty from "../../../../models/Faculty";
import { User } from "../../../../models/User";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { assetId, facultyId, description} = body;

    if (!assetId || !facultyId || !description) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const user = await User.findById(facultyId);
    if (!user) {
      return NextResponse.json({ error: `No user found.` }, { status: 409 });
    }
    console.log(user);

    const faculty = await Faculty.findOne({ Email: user.Email });
    if (!faculty) {
      return NextResponse.json({ error: `No faculty with this email found.` }, { status: 409 });
    }
    console.log(faculty);

    const asset = await Assets.findById(assetId);
    if (!asset) {
      return NextResponse.json({ error: `No asset found.` }, { status: 409 });
    }

    const updatedAsset = await Assets.findByIdAndUpdate(
      assetId,
      {
        $push: {
          Issue_Reported: {
            FacultyDetails: faculty._id,
            IssueDescription: description,
            Status: "pending",
          },
        },
      },
      { new: true } 
    ).populate("Issue_Reported.FacultyDetails", "facultyName");

    return NextResponse.json(
      {
        message: "Issue added successfully",
        asset: updatedAsset,
      },
    );

  } catch (error) {
    console.error("Error adding lab:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
