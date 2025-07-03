import { connect } from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI: string = process.env.MONGODB_URI!;
    await connect(mongoURI);
    console.log("MongoDB Connected...");
  } catch (err: any) {
    console.error("mongo error", err);
    process.exit(1);
  }
};

export default connectDB;
