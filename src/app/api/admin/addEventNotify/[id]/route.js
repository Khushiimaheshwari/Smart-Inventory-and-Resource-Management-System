import { NextResponse } from "next/server";
import { connectDB } from "../../../utils/db";
import Lab from "../../../../../models/Labs";
import mongoose from "mongoose";

export async function POST(req, { params }) {
  try {
    await connectDB();

    const { id } = params;  
    console.log(id);

    if (!id) {
      return NextResponse.json({ error: "Invalid Lab ID" }, { status: 400 });
    }

    const body = await req.json();
    const { eventType, date, startTime, endTime, description } = body;

    if (!eventType || !date || !startTime || !endTime || !description) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const eventEntry = {
      EventType: eventType,
      Date: new Date(date),
      StartTime: startTime,
      EndTime: endTime,
      Description: description,
    };

    const updatedLab = await Lab.findByIdAndUpdate(
      id,
      { $push: { NotifyEvent: eventEntry } },
      { new: true }
    );

    if (!updatedLab) {
      return NextResponse.json(
        { error: "Lab not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Event Notification added successfully",
      eventNotify: updatedLab.NotifyEvent,
    });

  } catch (error) {
    console.error("Error adding event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
