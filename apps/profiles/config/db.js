import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Profile service DB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Profile service DB error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
