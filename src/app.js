import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import createHttpError from "http-errors";
import morgan from "morgan";
import authRouter from "./routers/auth.router.js";

const app = express();

// middleware
app.use(express.json());

// Rate limiting configuration
const limiterApi = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, Please Try Again Later!",
});

// Middleware setup
app.use(
  cors({
    origin: "*",
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

// All router middleware
app.use("/api", authRouter);

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
