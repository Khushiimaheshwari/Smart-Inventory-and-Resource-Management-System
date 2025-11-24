import mongoose from "mongoose";
import { connectDB } from "../app/api/utils/db.js";

const LabSchema = new mongoose.Schema({
  Lab_ID: { type: String, unique: true, required: true },
  Lab_Name: { type: String, required: true },
  Block: { type: String, default: "" },
  Lab_Room: { type: String, default: "" },
  LabTechnician: [{ type: mongoose.Schema.Types.ObjectId, ref: "LabTechnician" }],
  Lab_Incharge: [{ type: mongoose.Schema.Types.ObjectId, ref: "Faculty", default: "" }],
  Total_Capacity: { type: Number, default: 0 },
  Status: { type: String, enum: ["active", "inactive"], default: "active" },
  Software_Specifications: { type: String, default: "" },
  Hardware_Specifications: { type: String, default: "" },
  PCs: [{ type: mongoose.Schema.Types.ObjectId, ref: "PCs" }],
  TimeTable: [{ type: mongoose.Schema.Types.ObjectId, ref: "Timetable" }],
  Remarks: { type: String, default: "" },
  Device: [{
    Device_Type: { type: String, enum:["projector", "screen board", "N/A"] , default: "" },
    Brand: { type: String, default: "" },
    Serial_No: { type: String, default: "" },
  }],
  NotifyEvent: [{
    EventType: { type: String , default: "" },
    Date: { type: Date },
    StartTime: { type: String, default: "" },
    EndTime: { type: String, default: "" },
    Description: { type: String, default: "" },
  }],

}, { timestamps: true });

const Lab = mongoose.models.Lab || mongoose.model("Lab", LabSchema);

export default Lab;