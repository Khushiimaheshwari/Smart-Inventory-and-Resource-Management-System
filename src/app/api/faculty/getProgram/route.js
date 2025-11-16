import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Programs from "../../../../models/Programs";
import SubjectList from "../../../../models/Subject_List";
import Faculty from "../../../../models/Faculty";
import Lab from "../../../../models/Labs";
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

    const faculty = await Faculty.findOne({ Email: email }).lean();
    if (!faculty) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
    }

    const facultyId = faculty._id.toString();

    let programs = await Programs.find()
      .populate("Subject.Subject_ID")
      .populate("Subject.Faculty_Assigned", "_id Name Email")
      .populate("Subject.Lab_Allocated");

    const filteredPrograms = programs.filter((program) =>
      program.Subject.some(
        (subj) =>
          subj.Faculty_Assigned?._id?.toString() === facultyId
      )
    );

    return NextResponse.json({ programs: filteredPrograms });

  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
 