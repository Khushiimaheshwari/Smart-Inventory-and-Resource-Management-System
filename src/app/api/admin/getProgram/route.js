import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Programs from "../../../../models/Programs";
import SubjectList from "../../../../models/Subject_List";
import Faculty from "../../../../models/Faculty";
import Lab from "../../../../models/Labs";

export async function GET() {
  try {
    await connectDB();

    const programs = await Programs.find().populate("Subject.Subject_ID").populate("Subject.Faculty_Assigned", "_id Name Email").populate("Subject.Lab_Allocated"); 

    return NextResponse.json({ programs });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
 