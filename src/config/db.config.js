import mongoose from "mongoose";

export const connectDb = async () => {
  try {

        const user = encodeURIComponent("root");
        const pass = encodeURIComponent("1234");
        const db = "afritech54";

        const connection = await mongoose.connect(
          `mongodb+srv://${user}:${pass}@cluster0.bm9g161.mongodb.net/${db}?retryWrites=true&w=majority&appName=Cluster0`
        );

    console.log("✅ Database Connected:", connection.connection.host);
  } catch (error) {
    console.error("❌ Database Connection Error!", error);
    process.exit(1);
  }
};
