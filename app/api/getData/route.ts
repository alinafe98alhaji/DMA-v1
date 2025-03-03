// import { NextRequest, NextResponse } from "next/server";
// import { MongoClient } from "mongodb";

// // Ensure that the MongoDB URI is defined
// if (!process.env.MONGODB_URI) {
//   throw new Error("MONGODB_URI is not defined in environment variables");
// }

// const clientPromise = MongoClient.connect(process.env.MONGODB_URI);

// export async function GET(req: NextRequest) {
//   try {
//     const userId = "6761c3f9f5abc5e97c14b899";
//     if (!userId) {
//       return NextResponse.json(
//         { success: false, error: "User ID is required" },
//         { status: 400 }
//       );
//     }

//     const client = await clientPromise;
//     const db = client.db("test");

//     const responses = await db
//       .collection("responses")
//       .find(
//         { "responses.score": { $exists: true }, userId: userId },
//         { projection: { responses: 1 } }
//       )
//       .toArray();

//     if (responses.length === 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "No responses found with scores for the specified user"
//         },
//         { status: 404 }
//       );
//     }

//     const aggregatedScores: { [key: string]: number } = {};

//     responses.forEach(response => {
//       response.responses.forEach((res: { area: string; score: number }) => {
//         if (aggregatedScores[res.area]) {
//           aggregatedScores[res.area] += res.score;
//         } else {
//           aggregatedScores[res.area] = res.score;
//         }
//       });
//     });

//     const summedScores = Object.keys(aggregatedScores).map(area => ({
//       area,
//       totalScore: aggregatedScores[area] / 13 * 100
//     }));

//     return NextResponse.json({ success: true, data: summedScores });
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

//-------------
//-------------
//-------------
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { getSession } from "../../lib/auth"; // Import authentication helper

// Ensure that MongoDB URI is available
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const clientPromise = MongoClient.connect(process.env.MONGODB_URI);

export async function GET(req: NextRequest) {
  try {
    // Retrieve the logged-in user's ID
    const session = await getSession(req);
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.userId;
    const client = await clientPromise;
    const db = client.db("test");

    // Retrieve responses filtered by userId and completionId
    const responses = await db
      .collection("responses")
      .find(
        { userId: userId, "responses.score": { $exists: true } },
        { projection: { responses: 1, completionId: 1 } }
      )
      .toArray();

    if (responses.length === 0) {
      return NextResponse.json(
        { success: false, error: "No responses found for this user" },
        { status: 404 }
      );
    }

    // Group responses by completionId
    const groupedResults: Record<string, { [key: string]: number }> = {};

    responses.forEach(response => {
      const { completionId, responses } = response;

      if (!groupedResults[completionId]) {
        groupedResults[completionId] = {};
      }

      responses.forEach((res: { area: string; score: number }) => {
        if (groupedResults[completionId][res.area]) {
          groupedResults[completionId][res.area] += res.score;
        } else {
          groupedResults[completionId][res.area] = res.score;
        }
      });
    });

    // Calculate percentage scores per completionId
    const calculatedPercentages = Object.entries(
      groupedResults
    ).map(([completionId, scores]) => ({
      completionId,
      results: Object.entries(scores).map(([area, totalScore]) => ({
        area,
        percentage: totalScore / 13 * 100
      }))
    }));

    return NextResponse.json({ success: true, data: calculatedPercentages });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
