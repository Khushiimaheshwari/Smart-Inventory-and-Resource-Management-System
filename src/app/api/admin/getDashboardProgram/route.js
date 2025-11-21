import { NextResponse } from "next/server";
import { connectDB } from "../../../../app/api/utils/db";
import Programs from "../../../../models/Programs";

export async function GET() {
  try {
    await connectDB();

    const programs = await Programs.find({})
      .populate("Subject.Subject_ID")
      .lean();

    const formatted = programs.map(program => {

      const parts = [];

      if (program.Program_Section && program.Program_Section.trim() !== "") {
        parts.push(`"${program.Program_Section}"`);
      }

      parts.push(program.Program_Name);

      parts.push(`Sem ${program.Program_Semester}`);

      if (program.Program_Group && program.Program_Group.trim() !== "") {
        parts.push(`Group ${program.Program_Group}`);
      }

      parts.push(`Batch ${program.Program_Batch}`);

      const programLabel = parts.join(" - ");

      return {
        program: programLabel,
        subjects: program.Subject.length
      };
    });

    return NextResponse.json({ programs: formatted });
  } catch (err) {
    console.error("Error fetching subjects by program:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
