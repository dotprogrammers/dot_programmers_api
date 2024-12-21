import { model, Schema } from "mongoose";

const teamMemberSchema = new Schema(
  {
    name: { type: String, required: [true, "Member name required!"] },
    designation: {
      type: String,
      required: [true, "Member designation required!"],
    },
    facebookLink: { type: String },
    linkedinLink: { type: String },
    whatsappNumber: {
      type: String,
      required: [true, "Member whatsapp number required!"],
    },
    image: { type: String, required: [true, "Member image required!"] },
    status: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const TeamMember = model("TeamMember", teamMemberSchema, "TeamMember");

export default TeamMember;
