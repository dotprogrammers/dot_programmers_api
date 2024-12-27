import fs from "fs";

import cloudinary from "../config/cloudinary.config.js";
import ServiceCount from "./../models/serviceCount.model.js";

const getServicesCounts = async (req, res) => {
  try {
    const { skip, limit } = req.pagination || {};
    let query = {};
    let servicesCounts;
    if (req.headers["x-source"] === "admin") {
      query = {};
      servicesCounts = await ServiceCount.find(query).skip(skip).limit(limit);
    } else if (req.headers["x-source"] === "frontend") {
      query = { status: 1 };
      servicesCounts = await ServiceCount.find();
    }

    const totalDataCount = await ServiceCount.countDocuments();

    res.status(200).json({
      success: true,
      payload: servicesCounts,
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

const addServiceCount = async (req, res) => {
  try {
    const { count, title } = req.body;

    // Ensure file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Icon is required.",
      });
    }

    // Validate required fields
    const missingFields = [];
    if (!count) missingFields.push("Count");
    if (!title) missingFields.push("Title");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `${missingFields.join(", ")} field(s) are required.`,
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

    // Create a new service document
    const newServiceCount = new ServiceCount({
      count,
      title,
      image: cloudinaryResult.secure_url,
      imagePublicId: cloudinaryResult.public_id,
      status: 1,
    });

    // Save to database
    await newServiceCount.save();

    res.status(201).json({
      success: true,
      message: "Service count added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add service count",
    });
  }
};

const deleteServiceCount = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Please provide service count id!",
      });
    }
    const serviceCount = await ServiceCount.findById(id);

    if (!serviceCount) {
      return res.status(404).json({
        success: false,
        message: "Service Count not found.",
      });
    }

    // Delete the image from Cloudinary
    if (serviceCount.image) {
      const publicId = serviceCount.imagePublicId;

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

    // Delete the service from the database
    await ServiceCount.findByIdAndDelete(id);

    res.json({ success: true, message: "Service Count deleted successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while deleting the service count.",
    });
  }
};

const updateServiceCount = async (req, res) => {
  try {
    const { id, ...otherFields } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid service count ID!",
      });
    }

    // Fetch the current service count data
    const serviceCount = await ServiceCount.findById(id);

    if (!serviceCount) {
      return res.status(404).json({
        success: false,
        message: "Service count not found!",
      });
    }

    // Handle image update if a new file is provided
    let updatedFields = { ...otherFields };

    if (req.file) {
      try {
        // Delete the previous image from Cloudinary
        if (serviceCount.imagePublicId) {
          await cloudinary.uploader.destroy(serviceCount.imagePublicId);
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
    await ServiceCount.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Service count updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the service count.",
    });
  }
};

export {
  addServiceCount,
  deleteServiceCount,
  getServicesCounts,
  updateServiceCount,
};
