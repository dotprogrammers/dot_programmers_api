import { model, Schema } from "mongoose";

const subscribeSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Subscribe = model("Subscribe", subscribeSchema, "Subscribe");
export default Subscribe;
