import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, unique: true, required: true },
  Password: { type: String, required: true },
  Role: {
    type: String,
    default: "faculty" 
  },
  ProfileImage: { type: String, default: "" },
  PhoneNumber: { type: String, default: "" },
  Location: { type: String, default: "" },
  AccountStatus: { type: String, enum: ["active", "inactive"], default: "active" },
  Designation: { type: String, default: "" },
  Department: { type: String, default: "" },
  Subject: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubjectList" }],

}, { timestamps: true });

const Faculty = mongoose.models.Faculty || mongoose.model("Faculty", FacultySchema);

export default Faculty;