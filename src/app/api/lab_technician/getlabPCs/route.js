import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import PCs from "../../../../models/Lab_PCs";
import Lab from "../../../../models/Labs";
import LabTechnician from "../../../../models/Lab_Technician";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const email = session.user.email;
      const role = session.user.role;

    if (role !== "lab_technician") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const technician = await LabTechnician.findOne({ Email: email }).populate("Labs");
    if (!technician) {
      return NextResponse.json({ error: "Technician not found" }, { status: 404 });
    }

    const labIds = technician.Labs.map(lab => lab._id);

    const pcs = await PCs.find(
      { Lab: { $in: labIds } },
      "_id PC_Name Lab Assets"
    ).populate("Lab", "Lab_ID Lab_Name");

    return NextResponse.json({ pcs });
  } catch (error) {
    console.error("Error fetching PCs:", error);
    return NextResponse.json({ error: "Failed to fetch PCs" }, { status: 500 });
  }
}