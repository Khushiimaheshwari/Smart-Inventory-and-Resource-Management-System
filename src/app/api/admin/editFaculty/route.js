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
    const { name, email, password, department, designation, subjects } = body;
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

    let subjectObjectIds;

    if (typeof subjects === "undefined") {
        subjectObjectIds = faculty.Subject || [];
    } else if (Array.isArray(subjects) && subjects.length === 0) {
        subjectObjectIds = [];
    } else {
        const validSubjects = Array.isArray(subjects)
            ? subjects.filter((id) => id && mongoose.isValidObjectId(id)).map(id => id.toString())
            : [];

        if (validSubjects.length === 0) {
            subjectObjectIds = faculty.Subject || [];
        } else {
            const existing = (faculty.Subject || []).map(id => id.toString());
            const merged = Array.from(new Set([...existing, ...validSubjects]));
            subjectObjectIds = merged.map(id => new mongoose.Types.ObjectId(id));
        }
    }

    const oldSubjects = (faculty.Subject || []).map((id) => id.toString());
    const newSubjects = (subjectObjectIds || []).map((id) => id.toString());

    const hasChanges =
        oldSubjects.length !== newSubjects.length ||
        !oldSubjects.every((id) => newSubjects.includes(id));

    faculty.Name = name;
    faculty.Email = email;
    faculty.Password = finalPassword;
    faculty.Department = department;
    faculty.Designation = designation;
    faculty.Subject = subjectObjectIds;
    await faculty.save();

    user.Name = name;
    user.Email = email;
    user.Password = finalPassword;
    await user.save();

    if (hasChanges) {

      await Programs.updateMany(
        { "Subject.Faculty_Assigned": faculty._id },
        { $set: { "Subject.$[elem].Faculty_Assigned": null } },
        { arrayFilters: [{ "elem.Faculty_Assigned": faculty._id }] }
      );

      if (subjectObjectIds.length > 0) {
        await Programs.updateMany(
          { "Subject.Subject_ID": { $in: subjectObjectIds } },
          {
            $set: {
              "Subject.$[elem].Faculty_Assigned": faculty._id,
            },
          },
          {
            arrayFilters: [{ "elem.Subject_ID": { $in: subjectObjectIds } }],
          }
        );
      }
    } else {
      console.log("Subjects unchanged — skipping Program update.");
    }

    return NextResponse.json({
      message: "Faculty updated successfully",
      updatedfaculty: {
        _id: faculty._id,
        name: faculty.Name,
        email: faculty.Email,
        department: faculty.Department,
        designation: faculty.Designation,
        subject: faculty.Subject,
      },
    });
  } catch (error) {
    console.error("Error updating faculty:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
