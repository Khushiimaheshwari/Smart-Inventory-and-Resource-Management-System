import { NextResponse } from "next/server";
import { connectDB } from "../../../utils/db";
import Timetable from "../../../../../models/Timetable";
import mongoose from "mongoose"; 

export async function POST(req, { params }) {
  try {
    await connectDB(); 

    const { timetableId } = params;
    const body = await req.json();

    let { Day, TimeSlot, Status, Lab } = body;

    if (!mongoose.Types.ObjectId.isValid(timetableId)) {
      return NextResponse.json(
        { error: "Invalid Timetable ID" },
        { status: 400 }
      );
    }

    if (!Day || !TimeSlot || !Status) {
      return NextResponse.json(
        { error: "Day, TimeSlot & Status are required" },
        { status: 400 }
      );
    }

    const conflictingSlot = await Timetable.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(timetableId) },
      Day,
      TimeSlot,
      Lab,
    });

    if (conflictingSlot) {
      return NextResponse.json(
        {
          error:
            "Another slot with same Day, Time & Program/Faculty already exists",
        },
        { status: 409 }
      );
    }

    const updatedSlot = await Timetable.findByIdAndUpdate(
      timetableId,
      {
        Day,
        TimeSlot,
        Status,
      },
      { new: true }
    );

    if (!updatedSlot) {
      return NextResponse.json(
        { error: "Timetable slot not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Slot updated successfully",
      updatedSlot,
    });

  } catch (error) {
    console.error("Error booking slot:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
