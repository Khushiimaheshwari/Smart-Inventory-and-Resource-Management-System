import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Assets from "../../../../models/Asset";

export async function GET() {
  try {
    await connectDB();

    const assetTypes = ["monitor", "keyboard", "mouse", "cpu" ,"ups", "Other"]; 
    const brands = ["iMac", "HP", "Lenovo"];

    const assetBreakdown = [];

    for (const type of assetTypes) {
      const breakdown = { category: type.charAt(0).toUpperCase() + type.slice(1), total: 0 };

      for (const brand of brands) {
        const count = await Assets.countDocuments({ Asset_Type: type, Brand: brand });
        breakdown[brand.toLowerCase()] = count;
        breakdown.total += count;
      }

      assetBreakdown.push(breakdown);
    }

    return NextResponse.json({ assetBreakdown });
  } catch (err) {
    console.error("Error fetching asset breakdown:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
