import mongoose from "mongoose";
import { connectDB } from "../app/api/utils/db.js";

const LabExpertSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, unique: true, required: true },
  Password: { type: String, required: true },
  Role: {
    type: String,
    default: "lab_expert"
  },
  ProfileImage: { type: String, default: "" },
  PhoneNumber: { type: String, default: "" },
  Location: { type: String, default: "" },
  AccountStatus: { type: String, enum: ["active", "inactive"], default: "active" },
  AccountAccess: { type: String, enum: ["View Only", "Add", "Edit", "All"], default: "View Only" },
  Labs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lab" }],

}, { timestamps: true });

const LabExpert = mongoose.models.LabExpert || mongoose.model("LabExpert", LabExpertSchema);

export default LabExpert;