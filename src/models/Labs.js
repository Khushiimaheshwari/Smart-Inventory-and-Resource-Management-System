import mongoose from "mongoose";

const LabSchema = new mongoose.Schema({
  Lab_ID: { type: String, unique: true, required: true },
  Lab_Name: { type: String, required: true },
  Block: { type: String, default: "" },
  Lab_Room: { type: String, default: "" },
  Lab_Incharge: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lab_Technician" }],
  Total_Capacity: { type: Number, default: 0 },
  Status: { type: String, enum: ["active", "inactive"], default: "active" },
  Software_Specifications: { type: String, default: "" },
  Hardware_Specifications: { type: String, default: "" },
  PCs: [{ type: mongoose.Schema.Types.ObjectId, ref: "PCs" }],
  TimeTable: { type: String, default: "" },
  Remarks: { type: String, default: "" },

}, { timestamps: true });

const Lab = mongoose.models.Lab || mongoose.model("Lab", LabSchema);

export default Lab;