import { NextResponse } from "next/server";
import { connectDB } from "../../../utils/db";
import Lab from "../../../../../models/Labs";
import PCs from "../../../../../models/Lab_PCs";
import Assets from "../../../../../models/Asset";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { labId } = params;

    if (!mongoose.Types.ObjectId.isValid(labId)) {
      return NextResponse.json(
        { error: "Invalid Lab ID" },
        { status: 400 }
      );
    }

    const lab = await Lab.findById(labId)
      .select("Lab_ID Lab_Name PCs")
      .lean();

    if (!lab) {
      return NextResponse.json({ error: "Lab not found" }, { status: 404 });
    }

    const pcs = await PCs.find({ Lab: labId })
      .populate({
        path: "Assets",
        model: "Assets"
      })
      .lean();

    const pcWiseData = pcs.map((pc) => {
      const details = {
        pcId: pc._id,
        pcName: pc.PC_Name,
        monitor: null,
        keyboard: null,
        mouse: null,
        ups: null,
        cpu: null
      };

      pc.Assets.forEach((asset) => {
        const item = {
          name: asset.Asset_Name,
          status: asset.Assest_Status
        };

        switch (asset.Asset_Type) {
          case "monitor":
            details.monitor = item;
            break;
          case "keyboard":
            details.keyboard = item;
            break;
          case "mouse":
            details.mouse = item;
            break;
          case "ups":
            details.ups = item;
            break;
          case "cpu":
            details.cpu = item;
            break;
        }
      });

      return details;
    });

    return NextResponse.json({
      labData: {
        Lab_ID: lab.Lab_ID,
        Lab_Name: lab.Lab_Name
      },
      assets: pcWiseData,
    });

  } catch (error) {
    console.error("Error fetching lab detail:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
