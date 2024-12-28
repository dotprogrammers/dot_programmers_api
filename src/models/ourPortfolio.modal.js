import { model, Schema } from "mongoose";

const ourPortfolioSchema = new Schema(
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

const OurPortfolio = model("OurPortfolio", ourPortfolioSchema, "OurPortfolio");

export default OurPortfolio;
