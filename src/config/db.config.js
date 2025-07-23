import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const user = encodeURIComponent(process.env.MONGODB_USERNAME);
    const pass = encodeURIComponent(process.env.MONGODB_PASSWORD);
    const db = process.env.DB_NAME;

    const connection = await mongoose.connect(
      `mongodb+srv://${user}:${pass}@lustermehedi.v8xdn.mongodb.net/${db}?retryWrites=true&w=majority`
      // `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@clustermehedi.v8xdn.mongodb.net/${process.env.DB_NAME}`
    );

    console.log("✅ Database Connected:", connection.connection.host);
  } catch (error) {
    console.error("❌ Database Connection Error!", error);
    process.exit(1);
  }
};
