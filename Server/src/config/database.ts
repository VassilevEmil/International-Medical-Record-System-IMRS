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
