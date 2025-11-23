import mongoose from "mongoose";
 
const TimetableSchema = new mongoose.Schema({
  Lab: {
    type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true,
  },
  Subject: {
    type: mongoose.Schema.Types.ObjectId, ref: "SubjectList", required: true,
  },
  Program: {
    type: mongoose.Schema.Types.ObjectId, ref: "Programs", required: true,
  },
  Faculty: {
    type: mongoose.Schema.Types.ObjectId, ref: "User",
  },
  Day: {
    type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], required: true,
  },
  TimeSlot: { type: String, required: true,},
  Status: { type: String, enum:[ "confirmed", "temporary"] }
}, { timestamps: true });

const Timetable = mongoose.models.Timetable || mongoose.model("Timetable", TimetableSchema);
export default Timetable;