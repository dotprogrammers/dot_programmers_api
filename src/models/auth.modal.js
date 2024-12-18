import { model, Schema } from "mongoose";

// auth schema
const authSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email format.",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long."],
    },
    role: { type: String, default: "admin" },
    token: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

// auth collection
const Auth = model("Auth", authSchema, "Auth");
export default Auth;
