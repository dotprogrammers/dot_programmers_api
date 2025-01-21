import Portfolio from "../models/portfolio.model.js";
import PortfolioFeatures from "./../models/portfolioFeatures.model.js";

const getPortfolioFeatures = async (req, res) => {
  try {
    const { skip, limit } = req.pagination;
    const search = req.query.search || "";
    const portfolioId = req.query.portfolioId || "";
    const searchRegex = new RegExp(search, "i");
    let query = {};
    if (req.headers["x-source"] === "admin") {
      query = {
        $and: [
          ...(portfolioId ? [{ portfolioId }] : []),
          {
            $or: [{ title: searchRegex }, { description: searchRegex }],
          },
        ],
      };
    } else if (req.headers["x-source"] === "frontend") {
      query = {
        $and: [
          { status: 1 },
          ...(portfolioId ? [{ portfolioId }] : []),
          {
            $or: [{ title: searchRegex }, { description: searchRegex }],
          },
        ],
      };
    }
    const portfolioFeature = await PortfolioFeatures.find(query)
      .skip(skip)
      .limit(limit);
    const totalDataCount = await PortfolioFeatures.countDocuments(query);

    res.status(200).json({
      success: true,
      payload: portfolioFeature,
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

const addPortfolioFeatures = async (req, res) => {
  try {
    const { title, description, portfolioId } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!title) missingFields.push("Title");
    if (!description) missingFields.push("Description");
    if (!portfolioId) missingFields.push("Portfolio ID");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `${missingFields.join(", ")} field(s) are required.`,
      });
    }

    // Create a new portfolio feature document
    const newPortfolioFeature = new PortfolioFeatures({
      title,
      description,
      portfolioId, // Associate the feature with a specific portfolio
      status: 1,
    });

    // Save the portfolio feature to the database
    await newPortfolioFeature.save();

    // Find the associated portfolio and add the feature ID to its features array
    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      portfolioId,
      { $push: { features: newPortfolioFeature._id } }, // Push the new feature ID into the features array
      { new: true } // Return the updated document
    );

    if (!updatedPortfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found.",
      });
    }

    res.status(201).json({
      success: true,
      message: "Portfolio feature added successfully",
    });
  } catch (error) {
    console.error("Error adding portfolio feature:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to add portfolio feature",
    });
  }
};

const deletePortfolioFeatures = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure portfolio feature ID is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide portfolio feature id!",
      });
    }

    // Find the portfolio feature by ID
    const portfolioFeature = await PortfolioFeatures.findById(id);
    if (!portfolioFeature) {
      return res.status(404).json({
        success: false,
        message: "Portfolio feature not found.",
      });
    }

    // Remove the feature reference from the related portfolio document
    await Portfolio.updateMany(
      { features: id }, // Find portfolios containing the feature
      { $pull: { features: id } } // Remove the feature from the features array
    );

    // Delete the portfolio feature from the PortfolioFeatures collection
    await PortfolioFeatures.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Portfolio feature deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "An error occurred while deleting the portfolio feature.",
    });
  }
};

const updatePortfolioFeatures = async (req, res) => {
  try {
    const { id, title, description, status } = req.body;

    // Ensure ID is provided
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid portfolio feature ID!",
      });
    }

    // Fetch the current portfolio feature data
    const portfolioFeature = await PortfolioFeatures.findById(id);

    if (!portfolioFeature) {
      return res.status(404).json({
        success: false,
        message: "Portfolio feature not found!",
      });
    }

    // Prepare the update data
    const updateData = {
      title,
      description,
      status,
    };

    // Update the portfolio feature
    const updatedPortfolioFeature = await PortfolioFeatures.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Return the updated document
      }
    );

    // Return the updated portfolio feature
    res.status(200).json({
      success: true,
      message: "Portfolio feature updated successfully.",
      updatedFeature: updatedPortfolioFeature,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "An error occurred while updating the portfolio feature.",
    });
  }
};

export {
  addPortfolioFeatures,
  deletePortfolioFeatures,
  getPortfolioFeatures,
  updatePortfolioFeatures,
};
