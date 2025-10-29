import mongoose from "mongoose";
import { connectDB } from "../app/api/utils/db.js";

const ProgramsSchema = new mongoose.Schema({
  Program_Name: { type: String, required: true },
  Program_Section: { type: String, required: true },
  Program_Semester: { type: String, required: true },
  Program_Group: { type: String, required: true },
  Program_Batch: { type: String, required: true },
  Subject:[{
    Subject_ID: { type: mongoose.Schema.Types.ObjectId, ref: "SubjectList" },
    Number_Of_Hours: { type: String, default: "" },
    Faculty_Assigned: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    Lab_Allocated: { type: mongoose.Schema.Types.ObjectId, ref: "Lab" },
  }],
}, { timestamps: true });

const Programs = mongoose.models.Programs || mongoose.model("Programs", ProgramsSchema);

export default Programs;