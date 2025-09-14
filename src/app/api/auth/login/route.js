import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { loginUser } from "../../../../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try { 
 
    const body = await request.json();    
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await loginUser({ email, password });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    log("User logged in:", user);

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
