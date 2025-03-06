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
// }import { NextResponse } from "next/server";import clientPromise from "../../../lib/mongodb";
import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
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

    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, name: user.name }, JWT_SECRET, {
      expiresIn: "7d"
    });

    // Set the token in cookies with HttpOnly, Secure flag
    const response = NextResponse.json(
      { message: "Login successful", userId: user._id, token },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
