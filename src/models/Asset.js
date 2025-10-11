import mongoose from "mongoose";
import { connectDB } from "../app/api/utils/db.js";

const AssetSchema = new mongoose.Schema({
  Asset_Name: { type: String, required: true },
  Asset_Type: { type: String, enum: ["monitor", "keyboard", "mouse", "cpu" ,"ups", "Other"], required: true },
  Assest_Status: { type: String, enum: ["Yes", "No", "Other"] , required: true },
  Brand: { type: String, default: "" },
  PC_Name: { type: mongoose.Schema.Types.ObjectId, ref: "PCs" },
  Lab_Name: { type: mongoose.Schema.Types.ObjectId, ref: "Lab" },
  Issue_Reported: { type: String, default: "" },
  QR_Code: { type: String, default: "" },
}, { timestamps: true });

const Assets = mongoose.models.Assets || mongoose.model("Assets", AssetSchema);

export default Assets;