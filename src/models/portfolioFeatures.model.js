import { model, Schema } from "mongoose";

const portfolioFeaturesSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Portfolio feature title required!"],
    },
    description: {
      type: String,
      required: [true, "Portfolio feature Description required!"],
    },
    portfolioId: {
      type: Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
    },
    status: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const PortfolioFeatures = model(
  "PortfolioFeatures",
  portfolioFeaturesSchema,
  "PortfolioFeatures"
);

export default PortfolioFeatures;
