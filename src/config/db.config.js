import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(
     // `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@clustermehedi.v8xdn.mongodb.net/${process.env.DB_NAME}`
       `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.bljc97k.mongodb.net/${process.env.DB_NAME}`
    );
     //mongoimport --uri  mongodb+srv://dotprogrammers:<enter_password>@cluster0.bljc97k.mongodb.net/<enter_database_name>  --collection  <enter_collection_name>  --type  JSON    --file  <enter path/to/file>
    // console.log(
    //   "Database Connected Successfully.",
    //   connectionInstance.connection.host
    // );
  } catch (error) {
    // console.log("Database Connection Error!", error);
    process.exit(1);
  }
};
