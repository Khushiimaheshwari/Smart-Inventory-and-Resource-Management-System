import { NextResponse } from "next/server";

// temporary DB substitute
let users = [];

export async function POST(req) {
  const data = await req.json();

  // add auto fields
  data.status = "Active";
  data.memberSince = new Date().toISOString().split("T")[0];

  users.push(data);

  console.log("Saved User:", data);

  return NextResponse.json({ success: true, user: data });
}
