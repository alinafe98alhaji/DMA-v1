import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || ""; 
if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const client = new MongoClient(uri);
const clientPromise =
  process.env.NODE_ENV === "development"
    ? (global._mongoClientPromise ||= client.connect()) // Use global in development
    : client.connect();

export default clientPromise;
