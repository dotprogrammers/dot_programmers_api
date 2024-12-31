import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// Ensure the key and IV are valid
const key = Buffer.from(process.env.ENCRYPTION_KEY, "utf8");
const iv = Buffer.from(process.env.ENCRYPTION_IV, "utf8");
const algorithm = "aes-256-cbc";

// Debugging: Check key and IV length
if (key.length !== 32) {
  throw new Error("ENCRYPTION_KEY must be 32 characters long!");
}
if (iv.length !== 16) {
  throw new Error("ENCRYPTION_IV must be 16 characters long!");
}

const encrypt = (text) => {
  try {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error.message);
    throw new Error("Encryption failed!");
  }
};

export default encrypt;
