import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import SubjectList from "../../../../models/Subject_List";
import Programs from "../../../../models/Programs";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const labId = searchParams.get("labId");

    if (!labId) {
      return NextResponse.json({ error: "Lab ID is required" }, { status: 400 });
    }

    const programsWithLab = await Programs.find({
      "Subject.Lab_Allocated": new mongoose.Types.ObjectId(labId),
    }).populate("Subject.Subject_ID");

    const subjectIds = [];
    programsWithLab.forEach((program) => {
      program.Subject.forEach((subj) => {
        if (subj.Lab_Allocated?.toString() === labId) {
          subjectIds.push(subj.Subject_ID?._id?.toString());
        }
      });
    });

    const subjects = await SubjectList.find(
      { _id: { $in: subjectIds } }, 
      "_id Course_Name Course_Code Course_Department Experiment_List Status Programs"
    ).populate({
      path: "Programs",
      populate: [
        {
          path: "Subject.Faculty_Assigned",
          model: "Faculty",
          select: "Name Email",
        },
      ],
    })
    .lean();

    const filteredSubjects = subjects.map((subject) => {
      return {
        ...subject,
        Programs: subject.Programs.map((prog) => {
          return {
            ...prog,
            Subject: prog.Subject.filter(
              (s) => s.Subject_ID?.toString() === subject._id.toString()
            ),
          };
        }),
      };
    });

    return NextResponse.json({ subjects: filteredSubjects  });
  } catch (error) {
    console.error("Error fetching subjects by lab:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
