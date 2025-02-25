// import { NextResponse } from "next/server";
// import clientPromise from "../../../lib/mongodb";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Missing email or password" },
//         { status: 400 }
//       );
//     }

//     const client = await clientPromise;
//     if (!client) {
//       return NextResponse.json(
//         { error: "Database connection failed" },
//         { status: 500 }
//       );
//     }
//     const db = client.db("test"); // Replace with your database name
//     const usersCollection = db.collection("users");

//     const user = await usersCollection.findOne({ email });
//     if (!user) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, {
//       expiresIn: "1d"
//     });

//     const response = NextResponse.json(
//       { message: "Login successful" },
//       { status: 200 }
//     );
//     response.cookies.set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       path: "/"
//     });

//     return response;
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    if (!client) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }
    const db = client.db("test");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d"
      }
    );

    const response = NextResponse.json({ message: "Login successful" });

    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Secure=${process.env.NODE_ENV ===
        "production"}`
    );

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
