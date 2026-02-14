import "server-only";
import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | null | undefined;
}

export async function getDatabase(): Promise<Db | null> {
  if (!uri) {
    console.warn("MONGODB_URI not configured");
    return null;
  }

  try {
    if (process.env.NODE_ENV === "development") {
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
      }
      clientPromise = global._mongoClientPromise;
    } else {
      if (!clientPromise) {
        client = new MongoClient(uri, options);
        clientPromise = client.connect();
      }
    }

    const connectedClient = await clientPromise;
    return connectedClient.db("healthcare_system");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return null;
  }
}
