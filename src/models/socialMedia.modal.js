import { model, Schema } from "mongoose";

const socialMediaSchema = new Schema(
  {
    facebookLink: {
      type: String,
      required: [true, "Facebook link required!"],
    },
    twitterLink: {
      type: String,
    },
    linkedinLink: {
      type: String,
      required: [true, "Linkedin link required!"],
    },
    instagramLink: {
      type: String,
    },
    youtubeLink: {
      type: String,
      required: [true, "Youtube link required!"],
    },
    whatsappNumber: {
      type: String,
      required: [true, "Whatsapp Number  required!"],
    },
  },
  { timestamps: true }
);

const SocialMedia = model("SocialMedia", socialMediaSchema, "SocialMedia");

export default SocialMedia;
