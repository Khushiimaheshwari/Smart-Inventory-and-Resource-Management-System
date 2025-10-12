import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../app/api/utils/db";
import LabTechnician from "../../../../models/Lab_Technician";
import Lab from "../../../../models/Labs";
import { User } from "../../../../models/User";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password, labAccess } = body;
    console.log(body);
    

    if (!name || !email || !password || !labAccess) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ Email: email });
    const existingTech = await LabTechnician.findOne({ Email: email });

    if (existingUser || existingTech) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      Name: name,
      Email: email,
      Password: hashedPassword,
      Role: "lab_technician",
    });

    const labObjectIds = labAccess.map((id) => new mongoose.Types.ObjectId(id));

    const newTech = await LabTechnician.create({
      Name: name,
      Email: email,
      Password: hashedPassword,
      Role: "lab_technician",
      Labs: labObjectIds,
    });

    await Lab.updateMany(
      { _id: { $in: labObjectIds } },
      { $push: { LabTechnician: newTech._id } }
    );

    return NextResponse.json({
      message: "Lab Technician created successfully",
      user: {
        _id: newUser._id,
        name: newUser.Name,
        email: newUser.Email,
        role: newUser.Role,
      },
      labTechnician: {
        _id: newTech._id,
        name: newTech.Name,
        labs: newTech.Labs,
      },
    });
  } catch (error) {
    console.error("Error creating lab technician:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
