import cloudinary from "../config/cloudinary.config.js";
import ServiceCount from "./../models/serviceCount.model.js";

const getServicesCounts = async (req, res) => {
  try {
    const { skip, limit } = req.pagination || {};
    const search = req.query.search || "";
    const searchRegex = new RegExp(search, "i");
    let query = {};
    let servicesCounts;
    if (req.headers["x-source"] === "admin") {
      query = { $or: [{ title: searchRegex }] };
      servicesCounts = await ServiceCount.find(query).skip(skip).limit(limit);
    } else if (req.headers["x-source"] === "frontend") {
      query = {
        status: 1,
        $or: [{ title: searchRegex }],
      };
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

    // Check if the data already exists
    const existingData = await ServiceCount.findOne({ title: title.trim() });
    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "Service Count title already exists.",
      });
    }

    const cloudinaryResult = req.file;

    // Create a new service document
    const newServiceCount = new ServiceCount({
      count,
      title,
      image: cloudinaryResult.path,
      imagePublicId: cloudinaryResult.filename,
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
    const { id, title, ...otherFields } = req.body;

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

    if (title && title.trim() !== serviceCount.title) {
      const existingService = await ServiceCount.findOne({
        title: title.trim(),
      });
      if (existingService) {
        return res.status(400).json({
          success: false,
          message: "Service Count title already exists!",
        });
      }
    }

    // Handle image update if a new file is provided
    let updatedFields = { ...otherFields };

    if (req.file) {
      try {
        if (serviceCount.imagePublicId) {
          await cloudinary.uploader.destroy(serviceCount.imagePublicId);
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
