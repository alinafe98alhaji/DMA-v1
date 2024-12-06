import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// Ensure that the MongoDB URI is defined
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const clientPromise = MongoClient.connect(process.env.MONGODB_URI);

// Define the expected structure for user percentages
interface UserPercentages {
  [userId: string]: {
    success: boolean;
    data: {
      area: string;
      totalScore: number;
    }[];
    error?: string;
  };
}

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("test");

    // Fetch all users from the 'users' collection
    const users = await db.collection("users").find().toArray();
    if (users.length === 0) {
      return NextResponse.json(
        { success: false, data: [], error: "No users found" },
        { status: 404 }
      );
    }

    // Prepare the response data
    const userPercentages: UserPercentages = {};

    // Process each user
    for (const user of users) {
      const userId = user._id.toString();

      // Fetch the responses for the current user from the "data use" collection
      const responses = await db
        .collection("responses")
        .find(
          { "responses.score": { $exists: true }, userId: userId },
          { projection: { responses: 1 } }
        )
        .toArray();

      if (responses.length === 0) {
        // Ensure 'data' is included even in the error case
        userPercentages[userId] = {
          success: false,
          data: [], // Empty data array to satisfy the interface
          error: `No responses found for user ${userId}`
        };
        continue;
      }

      // Calculate the aggregated scores for the current user
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

      // Adjust the calculation as needed based on the collection (e.g., divide by 10)
      const summedScores = Object.keys(aggregatedScores).map(area => ({
        area,
        totalScore: aggregatedScores[area] / 13 * 100 // Assuming the divisor is 10, adjust as needed
      }));

      userPercentages[userId] = {
        success: true,
        data: summedScores
      };
    }

    // Return the percentages for all users
    return NextResponse.json({ success: true, data: userPercentages });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, data: [], error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
