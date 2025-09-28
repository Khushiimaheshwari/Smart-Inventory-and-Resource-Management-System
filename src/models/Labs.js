import mongoose from "mongoose";
import { connectDB } from "../app/api/utils/db.js";

const LabSchema = new mongoose.Schema({
  Lab_Name: { type: String, required: true },
  PCs: [{ type: mongoose.Schema.Types.ObjectId, ref: "PCs" }],
}, { timestamps: true });

const Lab = mongoose.models.Lab || mongoose.model("Lab", LabSchema);

export default Lab;