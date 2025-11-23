import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Timetable from "../../../../models/Timetable";
import Lab from "../../../../models/Labs";
import mongoose from "mongoose"; 

export async function POST(req) {
  try {
    await connectDB(); 

    const body = await req.json();
    console.log(body);
    
    let { Subject, Program, Faculty , Day, TimeSlot, Status, Lab: id } = body;

    if (!Subject || !Program || !Day || !TimeSlot || !Status || !id) {
      return NextResponse.json({ error: "All details are required" }, { status: 400 });
    }

    if (Faculty === "Not Assigned" || !mongoose.Types.ObjectId.isValid(Faculty)) {
        Faculty = null; 
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid Lab ID" },
        { status: 400 }
      );
    }

    const existingSlot = await Timetable.findOne({
      Day: Day,
      TimeSlot: TimeSlot,
      Lab: id,
      $or: [
        { Faculty: Faculty, Program: Program },
        { Faculty: null }
      ]
    });

    if (existingSlot) {
      return NextResponse.json({ error: "Slot at this Day and Time already exists for this Program and Faculty" }, { status: 409 });
    }

    const newBooking = await Timetable.create({
      Subject: Subject,
      Program: Program,
      Faculty: Faculty,
      Day: Day,
      TimeSlot: TimeSlot,
      Status: Status,
      Lab: id,
    });

    await Lab.findByIdAndUpdate(id, {
        $push: { TimeTable: newBooking._id },
    });

    return NextResponse.json({
      message: "Slot Booked added successfully",
      subjects: newBooking,
    });

  } catch (error) {
    console.error("Error booking slot:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
