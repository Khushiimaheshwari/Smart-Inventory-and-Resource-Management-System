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
    ).populate("Programs");

    return NextResponse.json({ subjects });
  } catch (error) {
    console.error("Error fetching subjects by lab:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
