import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;
  console.log("Running middleware for:", pathname);
  console.log("Token found:", !!token);

  const publicRoutes = ["/login", "/signup", "/"];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    

    // Role-based access
    if (pathname.startsWith("/adminPanel") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname.startsWith("/facultyPanel") && decoded.role !== "faculty") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (pathname.startsWith("/lab_technicianPanel") && decoded.role !== "lab_technician") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/adminPanel/:path*", "/facultyPanel/:path*", "/lab_technicianPanel/:path*"],
};
