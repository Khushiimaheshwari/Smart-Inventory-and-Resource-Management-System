import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import SubjectList from "../../../../models/Subject_List";
import Programs from "../../../../models/Programs";
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

    const faculty = await Faculty.findOne({ Email: session.user.email }).lean();
    if (!faculty) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
    }

    const facultyId = faculty._id.toString();

    let subjects = await SubjectList.find(
      {},
      "_id Course_Name Course_Code Course_Department Experiment_List Status"
    )
      .populate({
        path: "Programs",
        populate: [
          {
            path: "Subject.Faculty_Assigned",
            model: "Faculty",
            select: "Name Email",
          },
          {
            path: "Subject.Lab_Allocated",
            model: "Lab",
            select: "Lab_ID Lab_Name",
          },
        ],
      });

    const filteredSubjects = subjects
      .map((subject) => {
        const subjectId = subject._id.toString();

        const facultyTeachesThisSubject = subject.Programs.some((program) =>
          program.Subject.some(
            (s) =>
              s.Subject_ID?.toString() === subjectId &&
              s.Faculty_Assigned?._id?.toString() === facultyId
          )
        );

        if (!facultyTeachesThisSubject) return null;

        const processedPrograms = subject.Programs.map((program) => {
          return {
            ...program.toObject(),
            Subject: program.Subject.filter(
              (s) => s.Subject_ID?.toString() === subjectId
            ), 
          };
        });

        return {
          ...subject.toObject(),
          Programs: processedPrograms,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ subjects: filteredSubjects });

  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}