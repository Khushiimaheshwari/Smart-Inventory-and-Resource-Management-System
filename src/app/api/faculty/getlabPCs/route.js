import { NextResponse } from "next/server";
import Faculty from "../../../../models/Faculty";
import Programs from "../../../../models/Programs";
import Lab from "../../../../models/Labs";
import PCs from "../../../../models/Lab_PCs";
import { connectDB } from "../../utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function GET(req) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = session.user.email;

    const faculty = await Faculty.findOne({ Email: email }).lean();
    if (!faculty) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 404 });
    }

    const programSubjectPairs = faculty.ProgramSubjectPairs;

    const results = [];

    for (const pair of programSubjectPairs) {
      const program = await Programs.findOne(
        {
          _id: pair.Program,
          "Subject.Subject_ID": pair.Subject
        },
        {
          Program_Name: 1,
          Subject: 1
        }
      ).lean();

      if (program) {
        const matchedSubject = program.Subject.find(
          (s) => s.Subject_ID.toString() === pair.Subject.toString()
        );

        if (matchedSubject?.Lab_Allocated) {
          const lab = await Lab.findById(matchedSubject.Lab_Allocated)
            .select("Lab_ID Lab_Name _id")
            .lean();

          const labPCs = await PCs.find({ Lab: lab._id })
            .select("PC_Name Assets _id")
            .lean();

          results.push({
            lab,
            pcs: labPCs
          });
        }
      }
    }

    const uniqueLabPCs = Array.from(
      new Map(results.map(item => [item.lab._id.toString(), item])).values()
    );

    return NextResponse.json({ pcs: uniqueLabPCs }, { status: 200 });

  } catch (error) {
    console.error("Error fetching faculty labs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}