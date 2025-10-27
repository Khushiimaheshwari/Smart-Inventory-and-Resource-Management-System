import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../utils/db";
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
    

    if (!name || !email) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const user = await User.findOne({ Email: email });
    const technician = await LabTechnician.findOne({ Email: email });

    if (!user || !technician) {
      return NextResponse.json({ error: "Lab Technician not found" }, { status: 404 });
    }

    let finalPassword = technician.Password;
    if (password && password.trim() !== "") {
      finalPassword = await bcrypt.hash(password, 10);
    }

    const labObjectIds = labAccess.map((id) => new mongoose.Types.ObjectId(id));

    await Lab.updateMany(
      { LabTechnician: technician._id },
      { $pull: { LabTechnician: technician._id } }
    );

    await Lab.updateMany(
      { _id: { $in: labObjectIds } },
      { $addToSet: { LabTechnician: technician._id } }
    );

    technician.Name = name;
    technician.Email = email;
    technician.Password = finalPassword;
    technician.Labs = labObjectIds;
    await technician.save();

    user.Name = name;
    user.Email = email;
    user.Password = finalPassword;
    await user.save();

    return NextResponse.json({
      message: "Lab Technician updated successfully",
      updatedTechnician: {
        _id: technician._id,
        name: technician.Name,
        email: technician.Email,
        labs: technician.Labs,
      },
    });
  } catch (error) {
    console.error("Error updating lab technician:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
