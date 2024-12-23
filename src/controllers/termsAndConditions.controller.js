import TermsAndConditions from "./../models/termsAndConditions.modal.js";

const getTermsAndConditions = async (req, res) => {
  try {
    const termsAndConditions = await TermsAndConditions.find();

    res.status(200).json({
      success: true,
      message: "Terms and conditions data was successfully retrieved.",
      payload: termsAndConditions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTermsAndConditions = async (req, res) => {
  try {
    const { id, description } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid terms and conditions ID!",
      });
    }

    // Fetch the current terms and conditions data
    const termsAndConditions = await TermsAndConditions.findById(id);

    if (!termsAndConditions) {
      return res.status(404).json({
        success: false,
        message: "Terms and conditions not found!",
      });
    }

    // Update the database with the new fields
    await TermsAndConditions.findByIdAndUpdate(
      id,
      { description },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Terms and conditions updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "An error occurred while updating the terms and conditions.",
    });
  }
};

export { getTermsAndConditions, updateTermsAndConditions };
