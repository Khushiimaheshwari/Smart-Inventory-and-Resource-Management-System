import { NextResponse } from "next/server";
import { connectDB } from "../../../../../app/api/utils/db.js";
import Lab from "../../../../../models/Labs";
import LabTechnician from "../../../../../models/Lab_Technician";
import Faculty from "../../../../../models/Faculty.js";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const body = await req.json();

    const { Lab_ID, Lab_Name, Block, Lab_Room, Total_Capacity, Status, LabTechnician, LabIncharge } = body;

    const existingLab = await Lab.findById(id)
      .populate("LabTechnician")
      .populate("Lab_Incharge");

    if (!existingLab) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 });
    }

    const newTechId = body.LabTechnician || null;  
    const newInchargeId = body.LabIncharge || null;
    console.log("Lab Technician" ,newTechId, "Lab Incharge", newInchargeId);
    
    const oldTechId = existingLab.LabTechnician?.[0]?._id?.toString();
    const oldInchargeId = existingLab.LabIncharge?.[0]?._id?.toString();

    if (newTechId && newTechId !== oldTechId) {
      if (oldTechId) {
        await LabTechnician.findByIdAndUpdate(oldTechId, {
          $pull: { Labs: id },
        });
      }

      await LabTechnician.findByIdAndUpdate(newTechId, {
        $addToSet: { Labs: id },
      });
    }

    if (newInchargeId && newInchargeId !== oldInchargeId) {
      if (oldInchargeId) {
        await Faculty.findByIdAndUpdate(oldInchargeId, {
          $pull: { Labs: id },
        });
      }

      await Faculty.findByIdAndUpdate(newInchargeId, {
        $addToSet: { Labs: id },
      });
    }

    const updatedLab = await Lab.findByIdAndUpdate(
      id,
      {
        Lab_ID,
        Lab_Name,
        Block,
        Lab_Room,
        Total_Capacity,
        Status,
        Lab_Technician: newTechId || null,
        Lab_Incharge: newInchargeId || null,
      },
      { new: true }
    )
      .populate("LabTechnician", "Name Email")
      .populate("Lab_Incharge", "Name Email");

    return NextResponse.json({
      message: "Lab updated successfully",
      lab: updatedLab,
    });

  } catch (error) {
    console.error("Error updating lab:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
