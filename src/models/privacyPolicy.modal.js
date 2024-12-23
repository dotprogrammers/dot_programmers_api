import { model, Schema } from "mongoose";

const privacyPolicySchema = new Schema(
  {
    description: {
      type: String,
      required: [true, "Description required!"],
    },
  },
  { timestamps: true }
);

const PrivacyPolicy = model(
  "PrivacyPolicy",
  privacyPolicySchema,
  "PrivacyPolicy"
);

export default PrivacyPolicy;
