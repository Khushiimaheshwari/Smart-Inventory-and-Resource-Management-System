import mongoose from "mongoose";
import { connectDB } from "../app/api/utils/db.js";
import Faculty from "./Faculty.js";

const AssetSchema = new mongoose.Schema({
  Asset_Name: { type: String, required: true },
  Asset_Type: { type: String, enum: ["monitor", "keyboard", "mouse", "cpu" ,"ups", "Other"], required: true },
  Assest_Status: { type: String, enum: ["Yes", "No", "Other"] , required: true },
  Brand: { type: String, default: "" },
  PC_Name: { type: mongoose.Schema.Types.ObjectId, ref: "PCs" },
  Lab_Name: { type: mongoose.Schema.Types.ObjectId, ref: "Lab" },
  QR_Code: { type: String, default: "" },
  Issue_Reported: [
    { 
      FacultyDetails: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
      IssueDescription: { type: String, default: "" },
      Status: { type: String, enum: ["pending", "resolved by technician", "approved"], default: "pending" },
      ResolveDescription: { type: String, default: "" },
    }
  ],
}, { timestamps: true });

const Assets = mongoose.models.Assets || mongoose.model("Assets", AssetSchema);

export default Assets;