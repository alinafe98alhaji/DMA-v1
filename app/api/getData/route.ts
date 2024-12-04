import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// Ensure that the MongoDB URI is defined
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const clientPromise = MongoClient.connect(process.env.MONGODB_URI);

export async function GET(req: NextRequest) {
  try {
    const userId = "674f9b980414a911facab6a8";
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("test");

    const responses = await db
      .collection("responses")
      .find(
        { "responses.score": { $exists: true }, userId: userId },
        { projection: { responses: 1 } }
      )
      .toArray();

    if (responses.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No responses found with scores for the specified user"
        },
        { status: 404 }
      );
    }

    const aggregatedScores: { [key: string]: number } = {};

    responses.forEach(response => {
      response.responses.forEach((res: { area: string; score: number }) => {
        if (aggregatedScores[res.area]) {
          aggregatedScores[res.area] += res.score;
        } else {
          aggregatedScores[res.area] = res.score;
        }
      });
    });

    const summedScores = Object.keys(aggregatedScores).map(area => ({
      area,
      totalScore: aggregatedScores[area]
    }));

    return NextResponse.json({ success: true, data: summedScores });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
