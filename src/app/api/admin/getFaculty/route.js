import { NextResponse } from "next/server";
import { connectDB } from "../../utils/db"
import Faculty from "../../../../models/Faculty"; 
import SubjectList from "../../../../models/Subject_List";
import Programs from "../../../../models/Programs";

export async function GET() {
  try {
    await connectDB();

    const faculties = await Faculty.find()
      .populate({
        path: "ProgramSubjectPairs.Program",
        select: "Program_Name Program_Semester Program_Batch Program_Section Program_Group",
      })
      .populate({
        path: "ProgramSubjectPairs.Subject",
        select: "Course_Name Course_Code Subject",
      })
      .lean();

    const facultiesWithPairs = faculties.map((faculty) => {
      const pairs = (faculty.ProgramSubjectPairs || []).map((pair) => ({
        programId: pair?.Program?._id,
        programName: pair?.Program?.Program_Name,
        programSemester: pair?.Program?.Program_Semester,
        programSection: pair?.Program?.Program_Section,
        programBatch: pair?.Program?.Program_Batch,
        programGroup: pair?.Program?.Program_Group,
        subjectId: pair?.Subject?._id,
        subjectName:
          pair?.Subject?.Course_Name || pair?.Subject?.Subject || "Unknown",
        subjectCode: pair?.Subject?.Course_Code || "",
      }));

      return {
        _id: faculty._id,
        Name: faculty.Name,
        Email: faculty.Email,
        Department: faculty.Department,
        Designation: faculty.Designation,
        AccountStatus: faculty.AccountStatus,
        ProgramSubjectPairs: pairs,
      };
    });

    return new Response(
      JSON.stringify({ faculty: facultiesWithPairs }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching faculty:", err);
    return new Response("Error fetching faculty data", { status: 500 });
  }
}