import { MongoClient } from "mongodb";

declare global {
  // Declare _mongoClientPromise globally with a consistent type
  // Use "var" instead of "let" or "const" for global variables
  let _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Ensure you have a valid MongoDB URI in your environment variables
const uri = process.env.MONGODB_URI || "";
if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable to preserve the MongoClient instance across module reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, do not use a global variable
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
