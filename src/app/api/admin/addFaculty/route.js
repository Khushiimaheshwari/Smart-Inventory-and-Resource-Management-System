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
    const { name, email, password, department, designation, subjects } = body;
    console.log(body);
    

    if (!name || !email || !password || !department  || !designation) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ Email: email });
    const existingFaculty = await Faculty.findOne({ Email: email });

    if (existingUser || existingFaculty) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      Name: name,
      Email: email,
      Password: hashedPassword,
      Role: "faculty",
    });

    const subjectsIds = subjects.map((id) => new mongoose.Types.ObjectId(id));

    const newFaculty = await Faculty.create({
      Name: name,
      Email: email,
      Password: hashedPassword,
      Role: "faculty",
      Department: department,
      Designation: designation,
      Subject: subjectsIds,
    });

    await Programs.updateMany(
        { "Subject.Subject_ID": subjectsIds }, 
        { $set: { "Subject.$[elem].Faculty_Assigned": newFaculty._id } },
        { arrayFilters: [{ "elem.Subject_ID": subjectsIds }] } 
        );


    return NextResponse.json({
      message: "Faculty created successfully",
      user: {
        _id: newUser._id,
        name: newUser.Name,
        email: newUser.Email,
        role: newUser.Role,
      },
      Faculty: {
        _id: newFaculty._id,
        name: newFaculty.Name,
        subject: newFaculty.Subject,
      },
    });
  } catch (error) {
    console.error("Error creating Faculty:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
