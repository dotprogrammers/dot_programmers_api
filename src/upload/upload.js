import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.config.js";

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dot_programmer",
    allowed_formats: ["jpeg", "png", "gif", "svg"],
  },
});

// Initialize Multer
const upload = multer({ storage });

export { upload };
