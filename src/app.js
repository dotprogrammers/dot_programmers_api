import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import fs from "fs";
import createHttpError from "http-errors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import aboutUsRouter from "./routers/aboutUs.router.js";
import authRouter from "./routers/auth.router.js";
import ceoRouter from "./routers/ceo.router.js";
import contactInfoRouter from "./routers/contactInfo.router.js";
import coreValueRouter from "./routers/coreValue.router.js";
import logoAndFaviconRouter from "./routers/logoAndFavicon.router.js";
import privacyPolicyRouter from "./routers/privacypolicy.router.js";
import serviceRouter from "./routers/service.router.js";
import serviceCountRouter from "./routers/serviceCount.router.js";
import siteConfigurationRouter from "./routers/siteConfiguration.router.js";
import socialMediaRouter from "./routers/socialmedia.router.js";
import teamMemberRouter from "./routers/teamMember.router.js";
import termsAndConditionsRouter from "./routers/termsAndConditions.router.js";
const app = express();

// middleware
app.use(express.json());

// Rate limiting configuration
const limiterApi = rateLimit({
  windowMs: 150 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, Please Try Again Later!",
});

// Manually define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dot-programmer-private-admin.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(limiterApi);

// Home route
app.get("/", (req, res) => {
  res.send("Dot Programmer Server Running.");
});

// image upload middleware
app.use("/images", express.static(path.join(__dirname, "images")));

// All router middleware
app.use("/api", authRouter);
app.use("/api", serviceRouter);
app.use("/api", serviceCountRouter);
app.use("/api", teamMemberRouter);
app.use("/api", privacyPolicyRouter);
app.use("/api", termsAndConditionsRouter);
app.use("/api", siteConfigurationRouter);
app.use("/api", contactInfoRouter);
app.use("/api", socialMediaRouter);
app.use("/api", logoAndFaviconRouter);
app.use("/api", aboutUsRouter);
app.use("/api", ceoRouter);
app.use("/api", coreValueRouter);

// 404 Not Found Handler
app.use((req, res, next) => {
  next(createHttpError(404, "Not Found!"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error!",
  });
});

export default app;
