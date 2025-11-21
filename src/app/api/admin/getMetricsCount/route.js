import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Lab from "../../../../models/Labs";
import Asset from "../../../../models/Asset";
import SubjectList from "../../../../models/Subject_List";
import Programs from "../../../../models/Programs";
import LabTechnician from "../../../../models/Lab_Technician";
import Faculty from "../../../../models/Faculty";

export async function GET() {
  try {
    await connectDB();

    const totalAssets = await Asset.countDocuments();
    const totalLabs = await Lab.countDocuments();
    const totalSubjects = await SubjectList.countDocuments();
    const totalPrograms = await Programs.countDocuments();
    const totalTechnicians = await LabTechnician.countDocuments();
    const totalFaculty = await Faculty.countDocuments();

    const metrics = {
      totalAssets,
      totalLabs,
      totalSubjects,
      totalPrograms,
      totalTechnicians,
      totalFaculty,
    };

     // ---------- ASSET CATEGORY DATA ----------
    const labs = await Lab.find({}, "Lab_Name").lean();
    let technical = 0;
    let nonTechnical = 0;

    labs.forEach((lab) => {
      const name = lab.Lab_Name.toLowerCase();
      if (
        name.includes("computer science") ||
        name.includes("electronics") ||
        name.includes("mechanics") ||
        name.includes("technical") // any other technical keywords
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

    labs.forEach((lab) => {
      const name = lab.Lab_Name.toLowerCase();
      if (name.includes("computer science")) labDistributionMap["Computer Science"] += 1;
      else if (name.includes("chemistry")) labDistributionMap["Chemistry"] += 1;
      else if (name.includes("mechanics")) labDistributionMap["Mechanics"] += 1;
      else if (name.includes("electronics")) labDistributionMap["Electronics"] += 1;
      else labDistributionMap["Others"] += 1;
    });

    const labDistributionData = Object.entries(labDistributionMap).map(([name, value], index) => {
      const colors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"];
      return { name, value, color: colors[index] };
    });

    // ---------- FACULTY DISTRIBUTION DATA ----------
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

    return NextResponse.json({
      metrics,
      assetCategoryData,
      labDistributionData,
      facultyDistributionData,
    });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
