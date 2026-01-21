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