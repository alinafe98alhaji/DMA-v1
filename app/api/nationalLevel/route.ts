import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { userId, questionID, responses } = body;

    // Validate the request body
    if (!userId || !questionID || !responses) {
      return NextResponse.json(
        {
          error:
            "Invalid request body. 'userId', 'questionID', and 'responses' are required."
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("test");

    // Insert the data into the "responses" collection
    const result = await db.collection("national level").insertOne({
      userId,
      questionID,
      responses,
      submittedAt: new Date()
    });

    return NextResponse.json(
      { message: "Data saved successfully", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving responses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
