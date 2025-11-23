import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Lab from "../../../../models/Labs";
import PCs from "../../../../models/Lab_PCs";
import Asset from "../../../../models/Asset";
import LabTechnician from "../../../../models/Lab_Technician";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "lab_technician") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const technician = await LabTechnician.findOne({ Email: session.user.email })
      .populate("Labs") // populate assigned labs
      .lean();

    if (!technician) {
      return NextResponse.json({ error: "Lab Technician not found" }, { status: 404 });
    }

    const assignedLabs = technician.Labs || [];

    // ---------- TOTAL LABS MANAGED ----------
    const totalLabs = assignedLabs.length;

    // ---------- TOTAL ASSETS (via PCs → Assets) ----------
    let totalAssets = 0;

    for (const lab of assignedLabs) {
      const pcs = await PCs.find({ Lab: lab._id }).select("Assets").lean();

      pcs.forEach((pc) => {
        if (Array.isArray(pc.Assets)) {
          totalAssets += pc.Assets.length;
        }
      });
    }

    const metrics = {
      totalLabs,
      totalAssets,
    };

    // ---------- ASSET CATEGORY DATA ----------
    let technical = 0;
    let nonTechnical = 0;

    assignedLabs.forEach((lab) => {
      const name = lab.Lab_Name.toLowerCase();
      if (
        name.includes("computer science") ||
        name.includes("electronics") ||
        name.includes("mechanics") ||
        name.includes("technical")
      ) {
        technical += 1;
      } else {
        nonTechnical += 1;
      }
    });

    const assetCategoryData = [
      { name: "Technical", value: technical, color: "#10b981" },
      { name: "Non-Technical", value: nonTechnical, color: "#3b82f6" },
    ];

    // ---------- LAB DISTRIBUTION DATA ----------
    const labDistributionMap = {
      "Computer Science": 0,
      Chemistry: 0,
      Mechanics: 0,
      Electronics: 0,
      Others: 0,
    };

    assignedLabs.forEach((lab) => {
      const name = lab.Lab_Name.toLowerCase();
      if (name.includes("computer science")) labDistributionMap["Computer Science"] += 1;
      else if (name.includes("chemistry")) labDistributionMap["Chemistry"] += 1;
      else if (name.includes("mechanics")) labDistributionMap["Mechanics"] += 1;
      else if (name.includes("electronics")) labDistributionMap["Electronics"] += 1;
      else labDistributionMap["Others"] += 1;
    });

    const labDistributionData = Object.entries(labDistributionMap).map(
      ([name, value], index) => {
        const colors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"];
        return { name, value, color: colors[index] };
      }
    );

    return NextResponse.json(
      {
        technicianName: technician.Name,
        technicianEmail: technician.Email,
        metrics,
        assignedLabs,
        assetCategoryData,
        labDistributionData,
      },
    );

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
