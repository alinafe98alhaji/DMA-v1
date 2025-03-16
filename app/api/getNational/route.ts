import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";

// Replace with your actual MongoDB URI
const client = new MongoClient(process.env.MONGODB_URI!);

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");

  // Parse cookies to get the token
  const token = cookieHeader
    ? cookieHeader.split(";").find(c => c.trim().startsWith("token="))?.split("=")[1]
    : undefined;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, name?: string };

    // Connect to MongoDB and use the 'test' database
    await client.connect();
    const db = client.db("test"); // Specify the 'test' database

    // List of collections to query
    const collections = [
      "data collection national",
      "data ownership and management national",
      "data openness and flow national",
      "data quality national",
      "data use national"
    ];

    // Fetch responses from all collections
    const responses = await Promise.all(
      collections.map(async (collectionName) => {
        const collection = db.collection(collectionName);
        const docs = await collection.find({ userId: decoded.userId }).toArray();
        // Add the collection name to each response
        return docs.map(doc => ({ ...doc, collection: collectionName }));
      })
    );

    // Flatten the responses from all collections
    const allResponses = responses.flat();

    if (allResponses.length === 0) {
      return NextResponse.json({ error: "No responses found" }, { status: 404 });
    }

    // Return the responses to the user, including the user's name
    return NextResponse.json({ responses: allResponses, userName: decoded.name });

  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}