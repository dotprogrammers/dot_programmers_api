import HowWeSuccess from "../models/howWeSuccess.model.js";

const getHowWeSuccess = async (req, res) => {
  try {
    const { skip, limit } = req.pagination;
    let query = {};
    const search = req.query.search || "";
    const searchRegex = new RegExp(search, "i");
    if (req.headers["x-source"] === "admin") {
      query = { $or: [{ title: searchRegex }] };
    } else if (req.headers["x-source"] === "frontend") {
      query = {
        status: 1,
        $or: [{ title: searchRegex }],
      };
    }
    const howWeSuccess = await HowWeSuccess.find(query).skip(skip).limit(limit);
    const totalDataCount = await HowWeSuccess.countDocuments();

    res.status(200).json({
      success: true,
      payload: howWeSuccess,
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

const addHowWeSuccess = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!title) missingFields.push("Title");
    if (!description) missingFields.push("Description");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `${missingFields.join(", ")} field(s) are required.`,
      });
    }

    // Check if the data already exists
    const existingData = await HowWeSuccess.findOne({ title: title.trim() });
    if (existingData) {
      return res.status(400).json({
        success: false,
        message: "Title already exists.",
      });
    }

    // Create a new how we success document
    const howWeSuccess = new HowWeSuccess({
      title,
      description,
      status: 1,
    });

    // Save to database
    await howWeSuccess.save();

    res.status(201).json({
      success: true,
      message: "How we success added successfully",
      howWeSuccess: howWeSuccess,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add how we success",
    });
  }
};

const deleteHowWeSuccess = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Please provide how we success id!",
      });
    }
    const howWeSuccess = await HowWeSuccess.findById(id);

    if (!howWeSuccess) {
      return res.status(404).json({
        success: false,
        message: "How we success not found.",
      });
    }

    // Delete the how we success from the database
    await HowWeSuccess.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "How we success deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while deleting the how we success.",
    });
  }
};

const updateHowWeSuccess = async (req, res) => {
  try {
    const { id, title, ...otherFields } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid How we success ID!",
      });
    }

    // Fetch the current How we success data
    const howWeSuccess = await HowWeSuccess.findById(id);

    if (!howWeSuccess) {
      return res.status(404).json({
        success: false,
        message: "How we success not found!",
      });
    }

    // Check if the updated name already exists in another service
    if (title && title.trim() !== howWeSuccess.title) {
      const existingData = await HowWeSuccess.findOne({
        title: title.trim(),
      });
      if (existingData) {
        return res.status(400).json({
          success: false,
          message: "Title already exists!",
        });
      }
    }

    // Handle image update if a new file is provided
    let updatedFields = { ...otherFields };

    // Update the database with the new fields
    const updatedHowWeSuccess = await HowWeSuccess.findByIdAndUpdate(
      id,
      updatedFields,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "How we success updated successfully.",
      data: updatedHowWeSuccess,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the how we success.",
    });
  }
};

export {
  addHowWeSuccess,
  deleteHowWeSuccess,
  getHowWeSuccess,
  updateHowWeSuccess,
};
