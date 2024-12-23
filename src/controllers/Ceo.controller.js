import fs from "fs";
import cloudinary from "../config/cloudinary.config.js";
import Ceo from "./../models/ceoModel.js";
const getCeo = async (req, res) => {
  try {
    const ceo = await Ceo.find();

    res.status(200).json({
      success: true,
      message: "Ceo data was successfully retrieved.",
      payload: ceo,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCeo = async (req, res) => {
  try {
    const { id, ...otherFields } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid ceo ID!",
      });
    }

    // Fetch the current ceo data
    const ceo = await Ceo.findById(id);

    if (!ceo) {
      return res.status(404).json({
        success: false,
        message: "Ceo not found!",
      });
    }

    // Handle file uploads to Cloudinary
    const updatedFields = { ...otherFields };
    if (req.file) {
      try {
        // Delete the previous image from Cloudinary
        if (ceo.imagePublicId) {
          await cloudinary.uploader.destroy(ceo.imagePublicId);
        }

        // Upload the new image to Cloudinary
        const cloudinaryResult = await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: "dot_programmer",
          }
        );

        // Add the new image data to updated fields
        updatedFields.image = cloudinaryResult.secure_url;
        updatedFields.imagePublicId = cloudinaryResult.public_id;
      } catch (imageError) {
        return res.status(500).json({
          success: false,
          message: "Image update failed.",
          error: imageError.message,
        });
      }
    }

    // Delete the image from the server after successful upload
    try {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (deleteError) {
      console.error("Error deleting file from server:", deleteError.message);
    }

    // Update the database with the new fields
    await Ceo.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Ceo updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating the ceo.",
    });
  }
};

export { getCeo, updateCeo };
