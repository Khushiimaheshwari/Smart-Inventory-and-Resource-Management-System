import mongoose from "mongoose";

const LabTechnicianSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, unique: true, required: true },
  Password: { type: String, required: true },
  Role: {
    type: String,
    default: "lab_technician" 
  },
  ProfileImage: { type: String, default: "" },
  PhoneNumber: { type: String, default: "" },
  Location: { type: String, default: "" },
  AccountStatus: { type: String, enum: ["active", "inactive"], default: "active" },
  Labs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lab" }],

}, { timestamps: true });

const LabTechnician = mongoose.models.LabTechnician || mongoose.model("LabTechnician", LabTechnicianSchema);

export default LabTechnician;