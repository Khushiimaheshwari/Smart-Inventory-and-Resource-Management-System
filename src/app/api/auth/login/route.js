// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { loginUser } from "../../../../models/User.js";

// const JWT_SECRET = process.env.JWT_SECRET; 

// export async function POST(request) {
//   try { 
 
//     const body = await request.json();    
//     const { email, password } = body;

//     if (!email || !password) {
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });
//     }

//     const user = await loginUser({ email, password });
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 401 });
//     }
//     console.log("User logged in:", user);

//     const token = jwt.sign(
//       { userId: user._id, email: user.Email, role: user.Role },
//       JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     console.log("Generated Token:", {userId: user._id, email: user.Email, role: user.Role});

//     const response = NextResponse.json(
//       { message: "User registered successfully", user },
//       { status: 201 }
//     );

//     response.cookies.set("token", token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//       path: '/',
//       maxAge: 7 * 24 * 60 * 60, // 7 days
//     });

//     return response;

//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { loginUser } from "../../../../models/User.js";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await loginUser({ email, password });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const nextAuthRes = await fetch(
      `${process.env.NEXTAUTH_URL}/api/auth/callback/credentials`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          csrfToken: "test",
          email,
          password,
        }),
      }
    );

    if (!nextAuthRes.ok) {
      return NextResponse.json({ error: "NextAuth login failed" }, { status: 500 });
    }

    const response = NextResponse.json({ message: "Login successful", user });

    const sessionCookie = nextAuthRes.headers.get("set-cookie");
    if (sessionCookie) {
      response.headers.set("set-cookie", sessionCookie);
    }

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}