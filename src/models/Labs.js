import mongoose from "mongoose";
import { connectDB } from "../app/api/utils/db.js";

const LabSchema = new mongoose.Schema({
  Lab_Name: { type: String, required: true },
  Lab_Technician: { type: String, required: true },
  TimeTable: { type: String, default: "" },
  Location: { type: String, default: "" },
  Software_Specifications: { type: String, default: "" },
  Hardware_Specifications: { type: String, default: "" },
  Total_Seats: { type: Number, default: 0 },
  PCs: [{ type: mongoose.Schema.Types.ObjectId, ref: "PCs" }],
}, { timestamps: true });

const Lab = mongoose.models.Lab || mongoose.model("Lab", LabSchema);

export default Lab;