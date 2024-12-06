// app/global.d.ts
import { MongoClient } from "mongodb";

declare global {
  // Declaring _mongoClientPromise on globalThis
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export {}; // Ensure this file is treated as a module
