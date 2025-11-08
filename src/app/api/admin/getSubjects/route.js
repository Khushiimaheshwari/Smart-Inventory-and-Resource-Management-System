import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import SubjectList from "../../../../models/Subject_List";
import Programs from "../../../../models/Programs";
import Faculty from "../../../../models/Faculty";
import Lab from "../../../../models/Labs";

export async function GET() {
  try {
    await connectDB();

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

      subjects = subjects.map((subject) => {
      const subjectId = subject._id.toString();

      const filteredPrograms = subject.Programs.map((program) => {
        const filteredSubjects = program.Subject.filter(
          (s) => s.Subject_ID?.toString() === subjectId
        );

        return {
          ...program.toObject(),
          Subject: filteredSubjects,
        };
      }).filter((p) => p.Subject.length > 0); 

      return {
        ...subject.toObject(),
        Programs: filteredPrograms,
      };
    });

    return NextResponse.json({ subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}