import { NextResponse } from "next/server";
import Programs from "../../../../models/Programs";
import SubjectList from "../../../../models/Subject_List";
import { connectDB } from "../../utils/db";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const { programName, section, semester, group, batch, subjects } = body;

    if (!programName || !semester || !batch) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const newProgram = new Programs({
      Program_Name: programName.trim(),
      Program_Section: section,
      Program_Semester: semester || "-",
      Program_Group: group || "-",
      Program_Batch: batch,
      Subject:
        Array.isArray(subjects) && subjects.length > 0
          ? subjects.map((sub) => ({
              Subject_ID: sub.Subject_ID || null,
              Number_Of_Hours: sub.Number_Of_Hours || "",
              Faculty_Assigned: sub.Faculty_Assigned || null,
              Lab_Allocated: sub.Lab_Allocated || null,
            }))
          : [],
    });

    const savedProgram = await newProgram.save();

    if (Array.isArray(subjects) && subjects.length > 0) {
      await Promise.all(
        subjects.map(async (sub) => {
          if (sub.Subject_ID) {
            await SubjectList.findByIdAndUpdate(
              sub.Subject_ID,
              {
                $addToSet: { Programs: savedProgram._id }  
              },
              { new: true }
            );
          }
        })
      );
    }

    return NextResponse.json(
      { program: savedProgram },
    );
    
  } catch (err) {
    console.error("Error adding program:", err);
    return NextResponse.json(
      { error: "Failed to add program.", details: err.message },
      { status: 500 }
    );
  }
}
