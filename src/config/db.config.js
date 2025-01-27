import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@clustermehedi.v8xdn.mongodb.net/${process.env.DB_NAME}`
    );
    // console.log(
    //   "Database Connected Successfully.",
    //   connectionInstance.connection.host
    // );
  } catch (error) {
    // console.log("Database Connection Error!", error);
    process.exit(1);
  }
};
