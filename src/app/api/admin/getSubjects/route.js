import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import SubjectList from "../../../../models/Subject_List";
import Programs from "../../../../models/Programs";

export async function GET() {
  try {
    await connectDB();

    const subjects = await SubjectList.find({}, "_id Course_Name Course_Code Course_Department Experiment_List Status").populate("Programs"); 

    return NextResponse.json({ subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
 