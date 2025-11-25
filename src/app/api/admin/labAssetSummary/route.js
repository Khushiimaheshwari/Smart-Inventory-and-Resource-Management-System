import { NextResponse } from "next/server";
import { connectDB } from "../../utils/db";
import Lab from "../../../../models/Labs";
import PCs from "../../../../models/Lab_PCs";
import Assets from "../../../../models/Asset";

export async function GET() {
  try {
    await connectDB();

    const labs = await Lab.find({}, "_id Lab_ID Lab_Name PCs").lean();

    const summary = [];

    for (const lab of labs) {
      const labId = lab._id;

      const pcs = await PCs.find({ Lab: labId })
        .select("_id PC_Name Assets")
        .lean();

      const pcCount = pcs.length;

      const allAssetIds = pcs.flatMap((pc) => pc.Assets);

      const assets = await Assets.find({ _id: { $in: allAssetIds } }).lean();

      const totalAssets = assets.length;

      const activeAssets = assets.filter(
        (asset) => asset.Assest_Status === "Yes"
      ).length;

      const nonActiveAssets = assets.filter(
        (asset) => asset.Assest_Status === "No"
      ).length;

      const underMaintenance = assets.filter((asset) => {
        const hasPendingIssue = asset.Issue_Reported?.some(
          (i) => i.Status === "pending"
        );
        return asset.Assest_Status === "No" || hasPendingIssue;
      }).length;

      summary.push({
        id: lab._id,
        labId: lab.Lab_ID,
        labName: lab.Lab_Name,
        pcCount,
        totalAssets,
        activeAssets,
        nonActiveAssets,
        underMaintenance,
      });
    }

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error("Error fetching lab asset summary:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
