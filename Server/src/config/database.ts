import mongoose from "mongoose";
import "dotenv/config";
import { MongoMemoryServer } from "mongodb-memory-server";

export const connectToProductionDatabase = async () => {
  try {
    const mongoDBUri: string = process.env.MONGODB_URI as string;
    await mongoose.connect(mongoDBUri, {});
    console.log("Successfully connected to MongoDB.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

// will delete this instance at the end

let mongod: MongoMemoryServer;

export const connectToTestDatabase = async () => {
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri, {});
    console.log("Successfully connected to MongoMemoryServer.");
  } catch (err) {
    console.error("MongoMemoryServer connection error:", err);
    process.exit(1);
  }
};

// export const connectToDatabase = async () => {
//   try {
//     const username = process.env.MONGODB_USERNAME;
//     const password = process.env.MONGODB_PASSWORD;
//     const mongoDBUri = `mongodb+srv://${username}:${password}@imrs.wqwqufn.mongodb.net/`;

//     await mongoose.connect(mongoDBUri, {});
//     console.log("Successfully connected to MongoDB1.");
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
//   }
// };
