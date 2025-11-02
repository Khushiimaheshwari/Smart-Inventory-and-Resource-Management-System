import mongoose from "mongoose";
import { connectDB } from "../app/api/utils/db.js";

const SubjectListSchema = new mongoose.Schema({
  Course_Name: { type: String, required: true },
  Course_Code: { type: String, required: true },
  Course_Department: { type: String, required: true },
  Experiment_List: { type: String, default: "" },
  Status: {type: String, enum: ["uploaded", "pending"], default: "pending"},
  Programs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Programs" }],
}, { timestamps: true });

const SubjectList = mongoose.models.SubjectList || mongoose.model("SubjectList", SubjectListSchema);

export default SubjectList; 