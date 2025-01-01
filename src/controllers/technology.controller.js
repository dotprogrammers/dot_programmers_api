import fs from "fs";

import cloudinary from "../config/cloudinary.config.js";
import Technology from "../models/technology.model.js";
const getCategoryTechnology = async (req, res) => {
  try {
    const { category } = req?.params;

    const query = { status: 1, category: category };
    const technology = await Technology.find(query);

    // Respond with the paginated data and metadata
    res.status(200).json({
      success: true,
      payload: technology,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTechnology = async (req, res) => {
  try {
    const { skip, limit } = req.pagination;
    const search = req.query.search || "";
    const searchRegex = new RegExp(search, "i");
    let query = {};
    if (req.headers["x-source"] === "admin") {
      query = { $or: [{ title: searchRegex }, { category: searchRegex }] };
    } else if (req.headers["x-source"] === "frontend") {
      query = {
        status: 1,
        $or: [{ title: searchRegex }, { category: searchRegex }],
      };
    }
    const technology = await Technology.find(query).skip(skip).limit(limit);
    const totalDataCount = await Technology.countDocuments();

    res.status(200).json({
      success: true,
      payload: technology,
      pagination: {
        totalData: totalDataCount,
        totalPages: Math.ceil(totalDataCount / limit),
        currentPage: req.pagination.page,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addTechnology = async (req, res) => {
  try {
    const { title, category, description } = req.body;

    // Ensure file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Technology Image is required.",
      });
    }

    // Validate required fields
    const missingFields = [];
    if (!title) missingFields.push("Title");
    if (!category) missingFields.push("Category");
    if (!description) missingFields.push("Description");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `${missingFields.join(", ")} field(s) are required.`,
      });
    }

    // Check if the data already exists
    const existingData = await Technology.findOne({ title: title.trim() });
    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "Technology title already exists.",
      });
    }

    // Upload to Cloudinary
    const imagePath = req.file.path;
    let cloudinaryResult;

    try {
      cloudinaryResult = await cloudinary.uploader.upload(imagePath, {
        folder: "dot_programmer",
      });
    } catch (uploadError) {
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (deleteError) {
        console.error("Error deleting file from server:", deleteError.message);
      }
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to Cloudinary",
        error: uploadError.message,
      });
    }

    // Delete the image from the server after successful upload
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (deleteError) {
      console.error("Error deleting file from server:", deleteError.message);
    }

    // Create a new technology document
    const newTechnology = new Technology({
      title,
      category,
      description,
      image: cloudinaryResult.secure_url,
      imagePublicId: cloudinaryResult.public_id,
      status: 1,
    });

    // Save to database
    await newTechnology.save();

    res.status(201).json({
      success: true,
      message: "Technology added successfully",
      technology: newTechnology,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add technology",
    });
  }
};
const deleteTechnology = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Please provide technology id!",
      });
    }
    const technology = await Technology.findById(id);

    if (!technology) {
      return res.status(404).json({
        success: false,
        message: "Technology not found.",
      });
    }

    // Delete the image from Cloudinary
    if (technology.image) {
      const publicId = technology.imagePublicId;

      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error(
          "Error deleting image from Cloudinary:",
          cloudinaryError.message
        );
        return res.status(500).json({
          success: false,
          message: "Failed to delete image from Cloudinary.",
          error: cloudinaryError.message,
        });
      }
    }

    // Delete the Technology from the database
    await Technology.findByIdAndDelete(id);

    res.json({ success: true, message: "Technology deleted successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while deleting the technology.",
    });
  }
};

const updateTechnology = async (req, res) => {
  try {
    const { id, title, ...otherFields } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid technology ID!",
      });
    }

    // Fetch the current Technology data
    const technology = await Technology.findById(id);

    if (!technology) {
      return res.status(404).json({
        success: false,
        message: "Technology not found!",
      });
    }

    // Check if the updated name already exists in another service
    if (title && title.trim() !== technology.title) {
      const existingService = await Technology.findOne({ title: title.trim() });
      if (existingService) {
        return res.status(400).json({
          success: false,
          message: "Technology title already exists!",
        });
      }
    }

    // Handle image update if a new file is provided
    let updatedFields = { ...otherFields };

    if (req.file) {
      try {
        // Delete the previous image from Cloudinary
        if (technology.imagePublicId) {
          await cloudinary.uploader.destroy(technology.imagePublicId);
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
    const updatedTechnology = await Technology.findByIdAndUpdate(
      id,
      updatedFields,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Technology updated successfully.",
      data: updatedTechnology,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the technology.",
    });
  }
};
export {
  addTechnology,
  deleteTechnology,
  getCategoryTechnology,
  getTechnology,
  updateTechnology,
};
