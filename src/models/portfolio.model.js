import { model, Schema } from "mongoose";

const portfolioSchema = new Schema(
  {
    name: { type: String, required: [true, "Portfolio name required!"] },
    description: {
      type: String,
      required: [true, "Portfolio Description required!"],
    },
    image: { type: String, required: [true, "Portfolio image required!"] },
    imagePublicId: { type: String },
    demoLink: {
      type: String,
      required: [true, "Portfolio demo link required!"],
    },
    status: { type: Number, default: 1 },
    features: [
      {
        type: Schema.Types.ObjectId,
        ref: "PortfolioFeatures", // Reference to the PortfolioFeatures model
      },
    ], // Array of PortfolioFeatures IDs
  },
  { timestamps: true }
);

const Portfolio = model("Portfolio", portfolioSchema, "Portfolio");

export default Portfolio;
