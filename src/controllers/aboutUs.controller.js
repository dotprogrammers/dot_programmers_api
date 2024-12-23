import AboutUs from "../models/aboutUsModal.js";

const getAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.find();

    res.status(200).json({
      success: true,
      message: "About us data was successfully retrieved.",
      payload: aboutUs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAboutUs = async (req, res) => {
  try {
    const { id, shortTitle, description, ourMission, ourVision } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid about us ID!",
      });
    }

    // Fetch the current about us data
    const aboutUs = await AboutUs.findById(id);

    if (!aboutUs) {
      return res.status(404).json({
        success: false,
        message: "About us not found!",
      });
    }

    // Update the database with the new fields
    await AboutUs.findByIdAndUpdate(
      id,
      { shortTitle, description, ourMission, ourVision },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "About us updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the about us.",
    });
  }
};

export { getAboutUs, updateAboutUs };
