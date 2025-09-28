import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../app/api/utils/db.js";

const PCSchema = new mongoose.Schema({
  PC_Name: { type: String, required: true },
  Assets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Asset" }],
}, { timestamps: true });

const PCs = mongoose.models.PC || mongoose.model("PCs", PCSchema);

export default PCs;