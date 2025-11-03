import { NextResponse } from "next/server";
import { connectDB } from "../../../../../app/api/utils/db";
import Lab from "../../../../../models/Labs";
import LabTechnician from "../../../../../models/Lab_Technician";
import Timetable from "../../../../../models/Timetable";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const lab = await Lab.findById(id
    )
      .populate("LabTechnician", "Name Email PhoneNumber")
      .populate({
        path: "TimeTable",
        select: "_id Subject Program Faculty Day TimeSlot",
        populate: [
          { path: "Subject", select: "Course_Name Course_Code" },
          { path: "Program", select: "Program_Name Program_Section Program_Semester Program_Batch Program_Group" },
          // { path: "User", select: "Name Email" },
        ],
      });

    return NextResponse.json({ lab });
  } catch (error) {
    console.error("Error fetching labs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
