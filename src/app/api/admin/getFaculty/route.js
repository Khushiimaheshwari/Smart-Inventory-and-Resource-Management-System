import { NextResponse } from "next/server";
import { connectDB } from "../../utils/db"
import { User } from "../../../../models/User"; 

export async function GET() {
  try {
    await connectDB();

    const faculty = await User.find({ Role: "faculty" }).select("_id Name Email");

    return NextResponse.json(
      { faculty },
    );
  } catch (error) {
    console.error("Error fetching faculty:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching faculty", error: error.message },
      { status: 500 }
    );
  }
}
