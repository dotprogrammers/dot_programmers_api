import CoreValue from "../models/coreValueModal.js";

const getCoreValue = async (req, res) => {
  try {
    const coreValue = await CoreValue.find();

    res.status(200).json({
      success: true,
      payload: coreValue,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addCoreValue = async (req, res) => {
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

    // Create a new core value document
    const newCoreValue = new CoreValue({
      title,
      description,
      status: 1,
    });

    // Save to database
    await newCoreValue.save();
    res.status(201).json({
      success: true,
      message: "Core value added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add core value",
    });
  }
};

const deleteCoreValue = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Please provide core value id!",
      });
    }
    const coreValue = await CoreValue.findById(id);

    if (!coreValue) {
      return res.status(404).json({
        success: false,
        message: "Core value not found.",
      });
    }

    // Delete the core value from the database
    await CoreValue.findByIdAndDelete(id);

    res.json({ success: true, message: "Core value deleted successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while deleting the core value.",
    });
  }
};

const updateCoreValue = async (req, res) => {
  try {
    const { id, ...otherFields } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid core value ID!",
      });
    }

    // Fetch the current core valud data
    const coreValue = await CoreValue.findById(id);

    if (!coreValue) {
      return res.status(404).json({
        success: false,
        message: "Core value not found!",
      });
    }

    // Handle image update if a new file is provided
    let updatedFields = { ...otherFields };

    // Update the database with the new fields
    await CoreValue.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Core value updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the core value.",
    });
  }
};

export { addCoreValue, deleteCoreValue, getCoreValue, updateCoreValue };
