import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import SubjectList from "../../../../models/Subject_List";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectDB(); 

    const body = await req.json();
    console.log(body);
    
    const { courseName, courseCode, courseDepartment } = body;

    if (!courseName || !courseCode || !courseDepartment) {
      return NextResponse.json({ error: "All details are required" }, { status: 400 });
    }

    const existingSubject = await SubjectList.findOne({ Course_Code: courseCode });
    if (existingSubject) {
      return NextResponse.json({ error: "Subject with this ID already exists" }, { status: 409 });
    }

    const newSubject = await SubjectList.create({
      Course_Name: courseName,
      Course_Code: courseCode,
      Course_Department: courseDepartment,
    });


    return NextResponse.json({
      message: "Subject added successfully",
      subjects: newSubject,
    });
  } catch (error) {
    console.error("Error adding Subject:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
