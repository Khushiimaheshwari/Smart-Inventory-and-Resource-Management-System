import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Lab from "../../../../models/Labs";
import Asset from "../../../../models/Asset";
import SubjectList from "../../../../models/Subject_List";
import Programs from "../../../../models/Programs";
import Faculty from "../../../../models/Faculty";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { cookies } from "next/headers";
 
async function callInternal(url) {
  const cookieHeader = cookies().toString();

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Cookie: cookieHeader
    },
    cache: "no-store"
  });

  return res.json();
}

export async function GET(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "faculty") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const faculty = await Faculty.findOne({ Email: session.user.email }).lean();
    if (!faculty) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
    }

    const baseUrl = req.nextUrl.origin;

    const subjectResponse = await callInternal(`${baseUrl}/api/faculty/getSubjects`);
    const subjects = subjectResponse.subjects || [];

    const labResponse = await callInternal(`${baseUrl}/api/faculty/getLabs`);
    const labs = labResponse.labs || [];

    const programResponse = await callInternal(`${baseUrl}/api/faculty/getProgram`);
    const programs = programResponse.programs || [];

    const assetsResponse = await callInternal(`${baseUrl}/api/faculty/getlabPCs`);
    const labAssets = assetsResponse.pcs || [];

    const totalLabAssets = labAssets.reduce((total, lab) => {
      const pcAssetCount = lab.pcs.reduce((sum, pc) => {
        const assetCount = Array.isArray(pc.Assets) ? pc.Assets.length : 0;
        return sum + assetCount;
      }, 0);

      return total + pcAssetCount;
    }, 0);


    const metrics = {
      totalSubjects: subjects.length,
      totalLabs: labs.length,
      totalPrograms: programs.length,
      totalLabAssets,
    };

    // ASSET DISTRIBUTION CHART
    let technical = 0;
    let nonTechnical = 0;

    labs.forEach((item) => {
      const name = item.lab?.Lab_Name?.toLowerCase() || item.Lab_Name?.toLowerCase() || "";

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
      { name: "Non-Technical", value: nonTechnical, color: "#3b82f6" }
    ];

    // LAB DISTRIBUTION CHART
    const labDistributionMap = {
      "Computer Science": 0,
      Chemistry: 0,
      Mechanics: 0,
      Electronics: 0,
      Others: 0
    };

    labs.forEach((item) => {
      const name = item.lab?.Lab_Name?.toLowerCase() || item.Lab_Name?.toLowerCase() || "";

      if (name.includes("computer science")) labDistributionMap["Computer Science"] += 1;
      else if (name.includes("chemistry")) labDistributionMap["Chemistry"] += 1;
      else if (name.includes("mechanics")) labDistributionMap["Mechanics"] += 1;
      else if (name.includes("electronics")) labDistributionMap["Electronics"] += 1;
      else labDistributionMap["Others"] += 1;
    });

    const colors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"];

    const labDistributionData = Object.entries(labDistributionMap).map(
      ([name, value], index) => ({
        name,
        value,
        color: colors[index]
      })
    );

    return NextResponse.json(
      {
        facultyName: faculty.Name,
        facultyEmail: faculty.Email,
        metrics,
        subjects,
        labs,
        programs,
        labAssets,
        assetCategoryData,
        labDistributionData
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
