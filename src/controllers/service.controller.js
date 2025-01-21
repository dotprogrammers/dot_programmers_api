import Service from "../models/service.model.js";

import cloudinary from "../config/cloudinary.config.js";

const getServices = async (req, res) => {
  try {
    const { skip, limit } = req.pagination;
    const search = req.query.search || ""; // Get the search term from query params
    const searchRegex = new RegExp(search, "i"); // Create a case-insensitive regex for searching

    // Determine the query based on the source and search term
    let query = {};
    if (req.headers["x-source"] === "admin") {
      query = { $or: [{ name: searchRegex }, { description: searchRegex }] };
    } else if (req.headers["x-source"] === "frontend") {
      query = {
        status: 1,
        $or: [{ name: searchRegex }, { description: searchRegex }],
      };
    }

    // Fetch services and total data count
    const services = await Service.find(query).skip(skip).limit(limit);
    const totalDataCount = await Service.countDocuments(query);

    // Respond with the data
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

    // Check if the data already exists
    const existingData = await Service.findOne({ name: name.trim() });
    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "Service name already exists.",
      });
    }

    // Upload to Cloudinary
    const cloudinaryResult = req.file;

    // Create a new service document
    const newService = new Service({
      name,
      description,
      image: cloudinaryResult.path,
      imagePublicId: cloudinaryResult.filename,
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
    const { id, name, ...otherFields } = req.body;

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

    // Check if the updated name already exists in another service
    if (name && name.trim() !== service.name) {
      const existingData = await Service.findOne({ name: name.trim() });
      if (existingData) {
        return res.status(400).json({
          success: false,
          message: "Service name already exists!",
        });
      }
    }

    // Handle image update if a new file is provided
    let updatedFields = { ...otherFields };
    if (name) {
      updatedFields.name = name.trim();
    }

    if (req.file) {
      try {
        if (service.imagePublicId) {
          await cloudinary.uploader.destroy(service.imagePublicId);
        }
        const cloudinaryResult = req.file;

        // Add the new image data to updated fields
        updatedFields.image = cloudinaryResult.path;
        updatedFields.imagePublicId = cloudinaryResult.filename;
      } catch (imageError) {
        return res.status(500).json({
          success: false,
          message: "Image update failed.",
          error: imageError.message,
        });
      }
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
