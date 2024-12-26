import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check and create folder if it doesn't exist
const ensureDirectoryExistence = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Set up storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../images");
    ensureDirectoryExistence(uploadPath);
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}`;
    cb(null, uniqueSuffix);
  },
});

// Initialize upload
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Only images are allowed."), false);
    } else {
      cb(null, true);
    }
  },
});

export { upload };
