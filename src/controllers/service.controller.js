import fs from "fs";
import Service from "../models/service.model.js";

import cloudinary from "../config/cloudinary.config.js";

const getServices = async (req, res) => {
  try {
    const { skip, limit } = req.pagination;
    let query = {};
    if (req.headers["x-source"] === "admin") {
      query = {};
    } else if (req.headers["x-source"] === "frontend") {
      query = { status: 1 };
    }
    const services = await Service.find(query).skip(skip).limit(limit);
    const totalDataCount = await Service.countDocuments();

    res.status(200).json({
      success: true,
      payload: services,
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

const addService = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Ensure file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Service Image is required.",
      });
    }

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push("Name");
    if (!description) missingFields.push("Description");

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
    const newService = new Service({
      name,
      description,
      image: cloudinaryResult.secure_url,
      imagePublicId: cloudinaryResult.public_id,
      status: 1,
    });

    // Save to database
    await newService.save();

    res.status(201).json({
      success: true,
      message: "Service added successfully",
      service: newService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add service",
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Please provide service id!",
      });
    }
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    // Delete the image from Cloudinary
    if (service.image) {
      const publicId = service.imagePublicId;

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
    await Service.findByIdAndDelete(id);

    res.json({ success: true, message: "Service deleted successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while deleting the service.",
    });
  }
};

const updateService = async (req, res) => {
  try {
    const { id, ...otherFields } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid service ID!",
      });
    }

    // Fetch the current service data
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found!",
      });
    }

    // Handle image update if a new file is provided
    let updatedFields = { ...otherFields };

    if (req.file) {
      try {
        // Delete the previous image from Cloudinary
        if (service.imagePublicId) {
          await cloudinary.uploader.destroy(service.imagePublicId);
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
    const updatedService = await Service.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      data: updatedService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating the service.",
    });
  }
};

const viewService = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Please provide service id!",
      });
    }
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Service found.", payload: service });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while viewing the service.",
    });
  }
};
export { addService, deleteService, getServices, updateService, viewService };
