import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// Ensure the MongoDB URI is defined
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const clientPromise = MongoClient.connect(process.env.MONGODB_URI);

interface UserResponses {
  [userId: string]: {
    success: boolean;
    data: {
      questionID: string;
      area: string;
      response: string;
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
    const userResponses: UserResponses = {};

    // Process each user
    for (const user of users) {
      const userId = user._id.toString();
      const userName = user.name.toString();

      // Fetch all responses for the user from multiple collections in parallel
      const responsesPromise = db
        .collection("data openess and flow")
        .find({ userId })
        .toArray();
      const collection1Promise = db
        .collection("data use")
        .find({ userId })
        .toArray();
      const collection2Promise = db
        .collection("data quality")
        .find({ userId })
        .toArray();
      const collection3Promise = db
        .collection("responses")
        .find({ userId })
        .toArray();
      const collection4Promise = db
        .collection("data ownership and management")
        .find({ userId })
        .toArray();

      // Wait for all responses to be fetched
      const [
        responses,
        collection1Responses,
        collection2Responses,
        collection3Responses,
        collection4Responses
      ] = await Promise.all([
        responsesPromise,
        collection1Promise,
        collection2Promise,
        collection3Promise,
        collection4Promise
      ]);

      if (
        responses.length === 0 &&
        collection1Responses.length === 0 &&
        collection2Responses.length === 0 &&
        collection3Responses.length === 0 &&
        collection4Responses.length === 0
      ) {
        userResponses[userId] = {
          success: false,
          data: [],
          error: `No responses found for user ${userId}`
        };
        continue;
      }

      // Collect all responses for the user
      const userResponsesData: {
        questionID: string;
        area: string;
        response: string;
      }[] = [];

      // Helper function to add responses from a collection
      const addResponses = (collectionResponses: any[]) => {
        collectionResponses.forEach(doc => {
          const questionID = doc.questionID; // Extract questionID
          doc.responses.forEach((res: { area: string; response: string }) => {
            userResponsesData.push({
              questionID,
              area: res.area,
              response: res.response
            });
          });
        });
      };

      // Add responses from all collections
      addResponses(responses);
      addResponses(collection1Responses);
      addResponses(collection2Responses);
      addResponses(collection3Responses);
      addResponses(collection4Responses);

      // Sort responses by questionID (assuming questionID is a string like "1", "2", etc.)
      userResponsesData.sort((a, b) => {
        const questionIDa = parseInt(a.questionID);
        const questionIDb = parseInt(b.questionID);
        return questionIDa - questionIDb;
      });

      // Add the user responses data
      userResponses[userName] = {
        success: true,
        data: userResponsesData
      };
    }

    // Return the responses for all users
    return NextResponse.json({ success: true, data: userResponses });
  } catch (error) {
    console.error("Error fetching user responses:", error);
    return NextResponse.json(
      { success: false, data: [], error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
