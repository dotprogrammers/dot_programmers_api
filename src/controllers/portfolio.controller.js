import fs from "fs";

import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.config.js";
import Portfolio from "./../models/portfolio.model.js";

const getPortfolioLimit = async (req, res) => {
  try {
    const { limit } = req.query;

    const parsedLimit = parseInt(limit) || 6;

    const portfolio = await Portfolio.find(
      {},
      "_id name description demoLink image"
    ).limit(parsedLimit);

    const totalDataCount = await Portfolio.countDocuments();

    res.status(200).json({
      success: true,
      payload: portfolio,
      totalData: totalDataCount,
      limit: parsedLimit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while fetching portfolios.",
    });
  }
};

const getAllPortfolios = async (req, res) => {
  try {
    const portfolio = await Portfolio.find().select("_id name");

    res.status(200).json({
      success: true,
      payload: portfolio,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const { skip, limit, page } = req.pagination;
    const category = req?.query?.category;
    const search = req.query.search || "";
    const searchRegex = new RegExp(search, "i");
    let query = {};
    let portfolio;
    if (req.headers["x-source"] === "admin") {
      query = { $or: [{ name: searchRegex }, { category: searchRegex }] };
      portfolio = await Portfolio.find(query)
        .skip(skip)
        .limit(limit)
        .populate("features", "title description");
    } else if (req.headers["x-source"] === "frontend") {
      if (category !== "all") {
        query = {
          status: 1,
          category: category,
          $or: [{ name: searchRegex }, { description: searchRegex }],
        };
      } else {
        query = {
          status: 1,
          $or: [{ name: searchRegex }, { description: searchRegex }],
        };
      }
      portfolio = await Portfolio.find(query).populate(
        "features",
        "title description"
      );
    }

    const totalDataCount = await Portfolio.countDocuments(query);

    // Respond with the paginated data and metadata
    res.status(200).json({
      success: true,
      payload: portfolio,
      pagination: {
        totalData: totalDataCount,
        totalPages: Math.ceil(totalDataCount / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addPortfolio = async (req, res) => {
  try {
    const { name, description, demoLink, category } = req.body;

    // Ensure file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Portfolio Image is required.",
      });
    }

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push("Name");
    if (!description) missingFields.push("Description");
    if (!demoLink) missingFields.push("Demo Link");
    if (!category) missingFields.push("Category");

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

    // Create a new portfolio document
    const newPortfolio = new Portfolio({
      name,
      description,
      image: cloudinaryResult.secure_url,
      imagePublicId: cloudinaryResult.public_id,
      demoLink,
      category,
      status: 1,
    });

    // Save to database
    await newPortfolio.save();

    res.status(201).json({
      success: true,
      message: "Portfolio added successfully",
    });
  } catch (error) {
    console.error("Error adding portfolio:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to add portfolio",
    });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Please provide portfolio id!",
      });
    }
    const portfolio = await Portfolio.findById(id);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found.",
      });
    }

    // Delete the image from Cloudinary
    if (portfolio.image) {
      const publicId = portfolio.imagePublicId;

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

    // Delete the portfolio from the database
    await Portfolio.findByIdAndDelete(id);

    res.json({ success: true, message: "Portfolio deleted successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while deleting the portfolio.",
    });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const { id, ...otherFields } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid portfolio ID!",
      });
    }

    // Fetch the current portfolio data
    const portfolio = await Portfolio.findById(id);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found!",
      });
    }

    // Handle image update if a new file is provided
    let updatedFields = { ...otherFields };

    if (req.file) {
      try {
        // Delete the previous image from Cloudinary
        if (portfolio.imagePublicId) {
          await cloudinary.uploader.destroy(portfolio.imagePublicId);
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
    await Portfolio.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Portfolio updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the portfolio.",
    });
  }
};

const viewPortfolio = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the provided ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid portfolio ID format.",
      });
    }

    // Define the aggregation pipeline
    const portfolioPipeline = [
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }, // Match the portfolio by ID
      },
      {
        $lookup: {
          from: "PortfolioFeatures", // Related collection
          localField: "_id", // Portfolio `_id`
          foreignField: "portfolioId", // Related field in PortfolioFeatures
          as: "features", // Alias for the joined data
        },
      },
      {
        $unwind: {
          path: "$features",
          preserveNullAndEmptyArrays: true, // Preserve portfolios without features
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          category: { $first: "$category" },
          image: { $first: "$image" },
          demoLink: { $first: "$demoLink" },
          features: { $push: "$features" },
        },
      },
    ];

    // Execute the aggregation query
    const portfolio = await Portfolio.aggregate(portfolioPipeline);

    if (!portfolio || portfolio.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found.",
      });
    }

    // Respond with the portfolio data
    res.status(200).json({
      success: true,
      message: "Portfolio found.",
      payload: portfolio[0], // Since only one portfolio is expected
    });
  } catch (error) {
    console.error("Error in viewPortfolio:", error);
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while viewing the portfolio.",
    });
  }
};

export default viewPortfolio;

export {
  addPortfolio,
  deletePortfolio,
  getAllPortfolios,
  getPortfolio,
  getPortfolioLimit,
  updatePortfolio,
  viewPortfolio,
};
