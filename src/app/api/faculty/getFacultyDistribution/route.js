import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Faculty from "../../../../models/Faculty";
 
export async function GET() {
  try {
    await connectDB();

    const facultyList = await Faculty.find({}, "Designation").lean();
    const facultyDistributionMap = {
        "Assistant Professor": 0,
        "Associate Professor": 0,
        "Professor": 0,
        "Visiting Faculty": 0,
        "Faculty (IP)": 0,
    };

    facultyList.forEach((fac) => {
        const desig = fac.Designation.trim(); 
        if (facultyDistributionMap.hasOwnProperty(desig)) {
            facultyDistributionMap[desig] += 1;
            }
        });

        const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ea5869", "#8b5cf6"]; 
        const facultyDistributionData = Object.entries(facultyDistributionMap).map(
            ([name, value], index) => ({ name, value, color: colors[index] })
        );

    return NextResponse.json({ facultyDistributionData });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
