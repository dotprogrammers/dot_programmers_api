import cloudinary from "../config/cloudinary.config.js";
import PagesSlider from "./../models/pagesSliders.modal.js";

const getPageNameSider = async (req, res) => {
  try {
    const { pageName } = req?.params;

    const query = { status: 1, pageName: pageName };
    const pageSlider = await PagesSlider.find(query);

    // Respond with the paginated data and metadata
    res.status(200).json({
      success: true,
      payload: pageSlider,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPagesSliders = async (req, res) => {
  try {
    const { skip, limit } = req.pagination;
    let query = {};
    const search = req.query.search || "";
    const searchRegex = new RegExp(search, "i");
    if (req.headers["x-source"] === "admin") {
      query = { $or: [{ title: searchRegex }, { pageName: searchRegex }] };
    } else if (req.headers["x-source"] === "frontend") {
      query = {
        status: 1,
        $or: [{ title: searchRegex }, { pageName: searchRegex }],
      };
    }
    const pagesSlider = await PagesSlider.find(query).skip(skip).limit(limit);
    const totalDataCount = await PagesSlider.countDocuments();

    res.status(200).json({
      success: true,
      payload: pagesSlider,
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

const addPagesSlider = async (req, res) => {
  try {
    const { title, description, pageName } = req.body;

    // Ensure file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required.",
      });
    }

    // Validate required fields
    const missingFields = [];
    if (!title) missingFields.push("Title");
    if (!pageName) missingFields.push("Page name");
    if (!description) missingFields.push("Description");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `${missingFields.join(", ")} field(s) are required.`,
      });
    }

    // Check if the data already exists
    const existingData = await PagesSlider.findOne({
      pageName: pageName.trim(),
    });
    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "Page name already exists.",
      });
    }

    const cloudinaryResult = req.file;

    // Create a new pages sliders document
    const newPagesSlider = new PagesSlider({
      title,
      pageName,
      description,
      image: cloudinaryResult.path,
      imagePublicId: cloudinaryResult.filename,
      status: 1,
    });

    // Save to database
    await newPagesSlider.save();

    res.status(201).json({
      success: true,
      message: "Page Slider added successfully",
      pageSlider: newPagesSlider,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add page slider",
    });
  }
};

const deletePagesSlider = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Please provide page slider id!",
      });
    }
    const pageSlider = await PagesSlider.findById(id);

    if (!pageSlider) {
      return res.status(404).json({
        success: false,
        message: "Page Slider not found.",
      });
    }

    if (pageSlider.image) {
      const publicId = pageSlider.imagePublicId;

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
    // Delete the Page Slider from the database
    await PagesSlider.findByIdAndDelete(id);

    res.json({ success: true, message: "Page Slider deleted successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while deleting the page slider.",
    });
  }
};

const updatePagesSlider = async (req, res) => {
  try {
    const { id, pageName, ...otherFields } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid page slider ID!",
      });
    }

    // Fetch the current Page Slider data
    const pageSlider = await PagesSlider.findById(id);

    if (!pageSlider) {
      return res.status(404).json({
        success: false,
        message: "Page Slider not found!",
      });
    }

    // Check if the updated name already exists in another service
    if (pageName && pageName.trim() !== pageSlider.pageName) {
      const existingdata = await PagesSlider.findOne({
        pageName: pageName.trim(),
      });
      if (existingdata) {
        return res.status(400).json({
          success: false,
          message: "Page name already exists!",
        });
      }
    }

    // Handle image update if a new file is provided
    let updatedFields = { ...otherFields };

    if (req.file) {
      try {
        if (pageSlider.imagePublicId) {
          await cloudinary.uploader.destroy(pageSlider.imagePublicId);
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
    const updatedPageSlider = await PagesSlider.findByIdAndUpdate(
      id,
      updatedFields,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Page Slider updated successfully.",
      data: updatedPageSlider,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the page slider.",
    });
  }
};

export {
  addPagesSlider,
  deletePagesSlider,
  getPageNameSider,
  getPagesSliders,
  updatePagesSlider,
};
