import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../app/api/utils/db";
import Faculty from "../../../../models/Faculty";
import Programs from "../../../../models/Programs";
import { User } from "../../../../models/User";
import mongoose from "mongoose"; 

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password, department, designation, programSubjectPairs } = body;

    console.log("ADD FACULTY BODY:", body);

    if (!name || !email || !password || !department || !designation) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ Email: email });
    const existingFaculty = await Faculty.findOne({ Email: email });

    if (existingUser || existingFaculty) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      Name: name,
      Email: email,
      Password: hashedPassword,
      Role: "faculty",
    });

    const validPairs = (programSubjectPairs || [])
      .filter(
        (p) =>
          p.programId &&
          p.subjectId &&
          mongoose.isValidObjectId(p.programId) &&
          mongoose.isValidObjectId(p.subjectId)
      )
      .map((p) => ({
        Program: new mongoose.Types.ObjectId(p.programId),
        Subject: new mongoose.Types.ObjectId(p.subjectId),
      }));

    const uniquePairs = Array.from(
      new Map(validPairs.map((p) => [p.Program + "_" + p.Subject, p])).values()
    );

    const newFaculty = await Faculty.create({
      Name: name,
      Email: email,
      Password: hashedPassword,
      Role: "faculty",
      Department: department,
      Designation: designation,
      ProgramSubjectPairs: uniquePairs,
    });

    for (const pair of uniquePairs) {
      await Programs.updateOne(
        {
          _id: pair.Program,
          "Subject.Subject_ID": pair.Subject,
        },
        {
          $set: { "Subject.$.Faculty_Assigned": newFaculty._id },
        }
      );
    }

    return NextResponse.json({
      message: "Faculty created successfully",
      user: {
        _id: newUser._id,
        name: newUser.Name,
        email: newUser.Email,
        role: newUser.Role,
      },
      faculty: {
        _id: newFaculty._id,
        name: newFaculty.Name,
        email: newFaculty.Email,
        department: newFaculty.Department,
        designation: newFaculty.Designation,
        programSubjectPairs: newFaculty.ProgramSubjectPairs,
      },
    });
  } catch (error) {
    console.error("Error creating Faculty:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
