import { model, Schema } from "mongoose";

const ourTeamMemberSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title required!"],
    },
    description: {
      type: String,
      required: [true, "Description required!"],
    },
  },
  { timestamps: true }
);

const OurTeamMember = model(
  "OurTeamMember",
  ourTeamMemberSchema,
  "OurTeamMember"
);

export default OurTeamMember;
