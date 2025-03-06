import clientPromise from "../../lib/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables");
}

export async function POST(req: Request) {
  try {
    // Extract the token from cookies
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = (decoded as jwt.JwtPayload).userId; // Extract userId from the decoded token

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { responses, subResponses } = await req.json();
    if (!responses) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const client = await clientPromise;
    if (!client) {
      throw new Error("Failed to connect to the database");
    }
    const db = client.db("test");
    const surveyCollection = db.collection("data quality national");

    // Save responses with userId
    const surveyData = {
      userId, // Ensure responses are tied to the logged-in user
      responses,
      subResponses,
      timestamp: new Date()
    };

    await surveyCollection.insertOne(surveyData);

    return NextResponse.json(
      { message: "Survey responses saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Survey Submission Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
