import { NextResponse } from "next/server";
import { connectDB } from "../../utils/db"
import Faculty from "../../../../models/Faculty"; 
import SubjectList from "../../../../models/Subject_List";

export async function GET() {
  try {
    await connectDB();

    const faculty = await Faculty.find({}).populate("Subject" ,"Course_Name Course_Code Course_Department Experiment_List Status Programs");

    return NextResponse.json(
      { faculty },
    );
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching faculty", error: error.message },
      { status: 500 }
    );
  }
}
