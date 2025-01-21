import cloudinary from "../config/cloudinary.config.js";
import Testimonial from "../models/testimonial.modal.js";

const getTestimonial = async (req, res) => {
  try {
    const { skip, limit } = req.pagination;
    let query = {};
    const search = req.query.search || "";
    const searchRegex = new RegExp(search, "i");
    if (req.headers["x-source"] === "admin") {
      query = { $or: [{ name: searchRegex }, { address: searchRegex }] };
    } else if (req.headers["x-source"] === "frontend") {
      query = {
        status: 1,
        $or: [{ name: searchRegex }, { address: searchRegex }],
      };
    }
    const testimonial = await Testimonial.find(query).skip(skip).limit(limit);
    const totalDataCount = await Testimonial.countDocuments();

    res.status(200).json({
      success: true,
      payload: testimonial,
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

const addTestimonial = async (req, res) => {
  try {
    const { name, address, rating, review } = req.body;

    // Ensure file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required.",
      });
    }

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push("Name");
    if (!address) missingFields.push("Address");
    if (!rating) missingFields.push("Rating");
    if (!review) missingFields.push("Review");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `${missingFields.join(", ")} field(s) are required.`,
      });
    }

    const cloudinaryResult = req.file;

    // Create a new Testimonial document
    const newTestimonial = new Testimonial({
      name,
      address,
      rating,
      review,
      image: cloudinaryResult.path,
      imagePublicId: cloudinaryResult.filename,
      status: 1,
    });

    // Save to database
    await newTestimonial.save();

    res.status(201).json({
      success: true,
      message: "Testimonial added successfully",
      testimonial: newTestimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add testimonial",
    });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Please provide testimonial id!",
      });
    }
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    if (testimonial.image) {
      const publicId = testimonial.imagePublicId;

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

    // Delete the Testimonial from the database
    await Testimonial.findByIdAndDelete(id);

    res.json({ success: true, message: "Testimonial deleted successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while deleting the testimonial.",
    });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const { id, ...otherFields } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid testimonial ID!",
      });
    }

    // Fetch the current Testimonial data
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found!",
      });
    }

    // Handle image update if a new file is provided
    let updatedFields = { ...otherFields };
    if (req.file) {
      try {
        if (testimonial.imagePublicId) {
          await cloudinary.uploader.destroy(testimonial.imagePublicId);
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
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      updatedFields,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully.",
      data: updatedTestimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the testimonial.",
    });
  }
};

export { addTestimonial, deleteTestimonial, getTestimonial, updateTestimonial };
