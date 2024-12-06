import { MongoClient } from "mongodb";

// Ensure that global._mongoClientPromise is recognized now
const uri = process.env.MONGODB_URI || ""; // Ensure this is set in your .env.local file
if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const client = new MongoClient(uri);
const clientPromise =
  process.env.NODE_ENV === "development"
    ? (global._mongoClientPromise ||= client.connect()) // Use global in development
    : client.connect();

export default clientPromise;
