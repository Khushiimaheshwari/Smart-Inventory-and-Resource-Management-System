// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

// export async function POST() {
//   try { 

//     cookies().set("token", "", {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//       path: '/',
//       maxAge: 0
//     });

//     return NextResponse.json(
//       { message: "Logged Out successfully" },
//       { status: 201 }
//     );

//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   }
// }

import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      path: "/",
      maxAge: 0, 
    });

    console.log(response);
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
