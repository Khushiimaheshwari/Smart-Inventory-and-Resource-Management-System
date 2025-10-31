import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Programs from "../../../../models/Programs";
import SubjectList from "../../../../models/Subject_List";

export async function GET() {
  try {
    await connectDB();

    const programs = await Programs.find().populate("Subject.Subject_ID").populate("Subject.Faculty_Assigned").populate("Subject.Lab_Allocated"); 
    // const programs = await Programs.find({}, "_id Program_Name Program_Section Program_Semester Program_Group Program_Batch Subject ").populate("Subject.Subject_ID").populate("Subject.Faculty_Assigned").populate("Subject.Lab_Allocated"); 

    return NextResponse.json({ programs });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
 