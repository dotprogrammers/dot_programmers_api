import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Service from "../models/service.model.js";

// Define __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    const image = process.env.APP_URL + "/images/" + req.file.filename;

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push("Name");
    if (!description) missingFields.push("Description");
    if (!image) missingFields.push("Service Image");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `${missingFields.join(", ")} field(s) are required.`,
      });
    }

    // const existingService = await Service.findOne({ name });

    // if (existingService) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Service already presented.",
    //   });
    // }

    // Create a new service document
    const newService = new Service({
      name,
      description,
      image: image,
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
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    // Optionally, delete the image file when deleting the service
    if (service.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        "images",
        path.basename(service.image)
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
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
    const { id, image, ...otherFields } = req.body;

    const images = req.file
      ? process.env.APP_URL + "/images/" + req.file.filename
      : null;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide service id!",
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

    // Update only the provided fields
    let updatedFields = {
      image: images && images,
      ...otherFields,
    };

    if (images) {
      // Delete the old image file when updating the service
      if (service.image) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "images",
          path.basename(service.image)
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updatedFields = {
        image: images && images,
        ...otherFields,
      };
    } else {
      updatedFields = {
        ...otherFields,
      };
    }

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
