import { model, Schema } from "mongoose";

const siteConfigurationSchema = new Schema(
  {
    title: { type: String, required: [true, "Title required!"] },
    description: {
      type: String,
      required: [true, "Description required!"],
    },
    copyRights: { type: String, required: [true, "Copy rights required!"] },
  },
  { timestamps: true }
);

const SiteConfiguration = model(
  "SiteConfiguration",
  siteConfigurationSchema,
  "SiteConfiguration"
);

export default SiteConfiguration;
