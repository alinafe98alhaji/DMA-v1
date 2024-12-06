// // app/lib/mongodb.ts
// import { MongoClient } from "mongodb";

// const uri = process.env.MONGODB_URI || "";
// if (!uri) {
//   throw new Error("Please define the MONGODB_URI environment variable");
// }

// const client = new MongoClient(uri);
// const clientPromise =
//   process.env.NODE_ENV === "development"
//     ? (globalThis._mongoClientPromise ||= client.connect()) // Use globalThis in development
//     : client.connect();

// export default clientPromise;

// app/lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, we can use a global variable for caching the Mongo client connection.
  // We use a singleton pattern here but do not rely on globalThis.
  clientPromise =
    global._mongoClientPromise ||
    (global._mongoClientPromise = new MongoClient(uri).connect());
} else {
  // In production, we can directly create a new MongoClient connection without global caching
  clientPromise = new MongoClient(uri).connect();
}

export default clientPromise;
