import { NextResponse } from "next/server";
import Programs from "../../../../../models/Programs";
import SubjectList from "../../../../../models/Subject_List";
import { connectDB } from "../../../utils/db";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await req.json();
    const { section, semester, group, subjects } = body;

    if ( !section || !semester) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const existingProgram = await Programs.findById(id);
    if (!existingProgram) {
        return NextResponse.json({ error: "Program not found." }, { status: 404 });
    }

    const updatedProgram = await Programs.findByIdAndUpdate(
      id,
      {
        Program_Name: existingProgram.Program_Name, 
        Program_Section: section,
        Program_Semester: semester,
        Program_Group: group || "-",
        Program_Batch: existingProgram.Program_Batch,
        Subject: Array.isArray(subjects)
          ? subjects.map((sub) => ({
              Subject_ID: sub.Subject_ID || null,
              Number_Of_Hours: sub.Number_Of_Hours || "",
              Faculty_Assigned: sub.Faculty_Assigned || null,
              Lab_Allocated: sub.Lab_Allocated || null,
            }))
          : [],
      },
      { new: true }
    );

    if (Array.isArray(subjects) && subjects.length > 0) {
      await Promise.all(
        subjects.map(async (sub) => {
          if (sub.Subject_ID) {
            await SubjectList.findByIdAndUpdate(
              sub.Subject_ID,
              { $addToSet: { Programs: id } }, 
              { new: true }
            );
          }
        })
      );
    }

    return NextResponse.json({ program: updatedProgram });
  } catch (err) {
    console.error("Error updating program:", err);
    return NextResponse.json(
      { error: "Failed to update program.", details: err.message },
      { status: 500 }
    );
  }
}
