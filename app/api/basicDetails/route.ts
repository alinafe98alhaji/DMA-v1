import clientPromise from "../../lib/mongodb"; // Ensure the path to your MongoDB client helper is correct
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the incoming JSON data
    const data = await req.json();

    // Validate the incoming data
    const { name, organisation, country } = data;
    if (!name || !organisation || !country) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("depa"); // your actual database name
    const collection = db.collection("basicDetails"); // users collection

    // Check if user already exists
    const existingUser = await collection.findOne({
      name,
      organisation,
      country
    });

    if (existingUser) {
      // If the user already exists, return the existing user_id
      return NextResponse.json(
        { message: "User already exists", userId: existingUser._id },
        { status: 200 }
      );
    }

    // Insert new user if not found
    const result = await collection.insertOne({
      name,
      organisation,
      country,
      submittedAt: new Date() // Automatically add a timestamp
    });

    // Respond with success and the new user_id
    return NextResponse.json(
      {
        message: "Basic details saved successfully!",
        userId: result.insertedId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting records:", error);
    return NextResponse.json(
      { message: "Failed to save record", error },
      { status: 500 }
    );
  }
}
