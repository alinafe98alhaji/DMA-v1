// import { MongoClient } from "mongodb";

// declare global {
//   // Declare _mongoClientPromise globally with a consistent type
//   // Use "var" instead of "let" or "const" for global variables
//   var _mongoClientPromise: Promise<MongoClient> | undefined;
// }

// // Ensure you have a valid MongoDB URI in your environment variables
// const uri = process.env.MONGODB_URI || "";
// if (!uri) {
//   throw new Error(
//     "Please define the MONGODB_URI environment variable inside .env.local"
//   );
// }

// let client: MongoClient;
// let _mongoClientPromiseclientPromise: Promise<MongoClient>;

// if (process.env.NODE_ENV === "development") {
//   // In development mode, use a global variable to preserve the MongoClient instance across module reloads
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri);
//     global._mongoClientPromise = client.connect();
//   }
//   _mongoClientPromise = global._mongoClientPromise;
// } else {
//   // In production mode, do not use a global variable
//   client = new MongoClient(uri);
//   _mongoClientPromise = client.connect();
// }

// export default _mongoClientPromise;

// import { MongoClient } from "mongodb";

// // Declare the global variable only once in the file
// declare global {
//   var mongoClientPromise: Promise<MongoClient> | undefined;
// }

// // Ensure you have a valid MongoDB URI in your environment variables
// const uri = process.env.MONGODB_URI || "";
// if (!uri) {
//   throw new Error(
//     "Please define the MONGODB_URI environment variable inside .env.local"
//   );
// }

// let client: MongoClient;

// if (process.env.NODE_ENV === "development") {
//   // In development mode, use a global variable to preserve the MongoClient instance across module reloads
//   if (!global.mongoClientPromise) {
//     client = new MongoClient(uri);
//     global.mongoClientPromise = client.connect();
//   }
// } else {
//   // In production mode, do not use a global variable
//   client = new MongoClient(uri);
//   global.mongoClientPromise = client.connect();
// }

// // Export the global promise directly without redeclaring it
// export default global.mongoClientPromise;

import { MongoClient, Db } from "mongodb";

// Ensure MONGODB_URI is defined
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const client = new MongoClient(uri);

// Define the type of clientPromise
let clientPromise: Promise<MongoClient> | undefined;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so the MongoClient is not constantly reinitialized
  if (global._mongoClientPromise) {
    clientPromise = global._mongoClientPromise;
  } else {
    global._mongoClientPromise = client.connect();
    clientPromise = global._mongoClientPromise;
  }
} else {
  // In production, it's safe to directly connect to the database
  clientPromise = client.connect();
}

export default clientPromise;
