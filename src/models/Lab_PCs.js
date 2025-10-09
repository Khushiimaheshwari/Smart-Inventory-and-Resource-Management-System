import mongoose from "mongoose";

const PCSchema = new mongoose.Schema({
  PC_Name: { type: String, required: true },
  Lab: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true },
  Assets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Asset" }],
}, { timestamps: true });

PCSchema.index({ PC_Name: 1, Lab: 1 }, { unique: true });

const PCs = mongoose.models.PCs || mongoose.model("PCs", PCSchema);

export default PCs;