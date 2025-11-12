import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../app/api/utils/db";
import Faculty from "../../../../models/Faculty";
import Programs from "../../../../models/Programs";
import { User } from "../../../../models/User";
import mongoose from "mongoose";;

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password, department, designation, programSubjectPairs } = body;

    console.log("EDIT FACULTY BODY:", body);

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and Email are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ Email: email });
    const faculty = await Faculty.findOne({ Email: email });

    if (!user || !faculty) {
      return NextResponse.json(
        { error: "Faculty not found" },
        { status: 404 }
      );
    }

    let finalPassword = faculty.Password;
    if (password && password.trim() !== "") {
      finalPassword = await bcrypt.hash(password, 10);
    }

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

    faculty.Name = name;
    faculty.Email = email;
    faculty.Password = finalPassword;
    faculty.Department = department;
    faculty.Designation = designation;
    faculty.ProgramSubjectPairs = uniquePairs;

    await faculty.save();

    user.Name = name;
    user.Email = email;
    user.Password = finalPassword;
    await user.save();

    await Programs.updateMany(
      { "Subject.Faculty_Assigned": faculty._id },
      { $set: { "Subject.$[elem].Faculty_Assigned": null } },
      { arrayFilters: [{ "elem.Faculty_Assigned": faculty._id }] }
    );

    for (const pair of uniquePairs) {
      await Programs.updateOne(
        {
          _id: pair.Program,
          "Subject.Subject_ID": pair.Subject,
        },
        {
          $set: { "Subject.$.Faculty_Assigned": faculty._id },
        }
      );
    }

    return NextResponse.json({
      message: "Faculty updated successfully",
      updatedFaculty: {
        _id: faculty._id,
        name: faculty.Name,
        email: faculty.Email,
        department: faculty.Department,
        designation: faculty.Designation,
        programSubjectPairs: faculty.ProgramSubjectPairs,
      },
    });
  } catch (error) {
    console.error("Error updating faculty:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}