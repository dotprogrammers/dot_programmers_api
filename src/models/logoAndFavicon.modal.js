import { model, Schema } from "mongoose";

const logoAndFavicon = new Schema(
  {
    logoLink: {
      type: String,
      required: [true, "Logo is required!"],
    },
    faviconLink: {
      type: String,
      required: [true, "Favicon is required!"],
    },
    logoPublicId: { type: String },
    faviconPublicId: { type: String },
  },
  { timestamps: true }
);

const LogoAndFavicon = model(
  "LogoAndFavicon",
  logoAndFavicon,
  "LogoAndFavicon"
);

export default LogoAndFavicon;
