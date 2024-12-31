import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// Convert the key and IV from environment variables
const key = Buffer.from(process.env.ENCRYPTION_KEY, "utf8");
const iv = Buffer.from(process.env.ENCRYPTION_IV, "utf8");
const algorithm = "aes-256-cbc"; // Common encryption algorithm

// Ensure the key and IV lengths are valid
if (key.length !== 32) {
  throw new Error("ENCRYPTION_KEY must be 32 characters (256 bits) long!");
}
if (iv.length !== 16) {
  throw new Error("ENCRYPTION_IV must be 16 characters (128 bits) long!");
}

const decrypt = (encryptedText) => {
  try {
    // Create the decipher instance
    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    // Perform decryption
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error.message);
    throw new Error(
      "Failed to decrypt the text. Ensure the data, key, and IV are correct."
    );
  }
};

export default decrypt;
