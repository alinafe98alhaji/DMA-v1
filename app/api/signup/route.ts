import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "../../lib/mongodb";

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
        { error: "Failed to connect to the database" },
        { status: 500 }
      );
    }
    const db = client.db("test"); // Change to your actual database name
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await usersCollection.insertOne({
      email,
      password: hashedPassword,
      hasCompletedAssessment: false,
      responses: {}
    });

    return NextResponse.json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
