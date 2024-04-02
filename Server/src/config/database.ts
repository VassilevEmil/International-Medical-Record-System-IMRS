import mongoose from "mongoose";
import "dotenv/config";

export const connectToDatabase = async () => {
  try {
    const mongoDBUri: string = process.env.MONGODB_URI as string;
    await mongoose.connect(mongoDBUri, {});
    console.log("Successfully connected to MongoDB.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
