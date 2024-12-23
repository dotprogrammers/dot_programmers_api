import PrivacyPolicy from "../models/privacyPolicy.modal.js";

const getPrivacyPolicy = async (req, res) => {
  try {
    const privacyPolicy = await PrivacyPolicy.find();

    res.status(200).json({
      success: true,
      message: "Privacy policy data was successfully retrieved.",
      payload: privacyPolicy,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePrivacyPolicy = async (req, res) => {
  try {
    const { id, description } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid privacy policy ID!",
      });
    }

    // Fetch the current privacy policy data
    const privacyPolicy = await PrivacyPolicy.findById(id);

    if (!privacyPolicy) {
      return res.status(404).json({
        success: false,
        message: "Privacy policy not found!",
      });
    }

    // Update the database with the new fields
    await PrivacyPolicy.findByIdAndUpdate(
      id,
      { description },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Privacy policy updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the privacy policy.",
    });
  }
};

export { getPrivacyPolicy, updatePrivacyPolicy };
