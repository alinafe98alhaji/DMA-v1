import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

// Ensure that the MongoDB URI is defined
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const clientPromise = MongoClient.connect(process.env.MONGODB_URI);

export async function GET(req: NextRequest) {
  try {
    // Extract the userId from the request URL
    const url = new URL(req.url);
    const userId = url.pathname.split("/").pop(); // Assuming userId is the last part of the URL path

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid User ID format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("test");

    // Convert the userId to ObjectId
    const objectId = new ObjectId(userId);

    // Fetch the user by userId from the 'users' collection
    const user = await db.collection("users").findOne({ _id: objectId });

    if (!user) {
      return NextResponse.json(
        { success: false, data: {}, error: `User with ID ${userId} not found` },
        { status: 404 }
      );
    }

    // Transform the user data to exclude _id and include user details
    const userDetails = {
      name: user.name || "Unknown",
      organisation: user.organisation || "Unknown",
      country: user.country || "Unknown",
      submittedAt: user.submittedAt
        ? new Date(user.submittedAt).toISOString()
        : "Unknown"
    };

    // Return the user details
    return NextResponse.json({ success: true, data: userDetails });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, data: [], error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
