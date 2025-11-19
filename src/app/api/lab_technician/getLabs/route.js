import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Lab from "../../../../models/Labs";
import LabTechnician from "../../../../models/Lab_Technician";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

// Labs

export async function GET() { 
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    console.log(session);
    
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

    const labs = await Lab.find({ _id: { $in: technician.Labs } })
      .populate("LabTechnician", "Name Email");
      // .populate("Lab_Incharge", "Name Email");

    return NextResponse.json({ labs });
  } catch (error) {
    console.error("Error fetching labs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
