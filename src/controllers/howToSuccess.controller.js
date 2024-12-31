import HowToSuccess from "../models/howToSuccess.modal.js";

const getHowToSuccess = async (req, res) => {
  try {
    const howToSuccess = await HowToSuccess.find();

    res.status(200).json({
      success: true,
      message: "How to success data was successfully retrieved.",
      payload: howToSuccess,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateHowToSuccess = async (req, res) => {
  try {
    const { id, title, description } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid our how to success ID!",
      });
    }

    // Fetch the current howToSuccess data
    const howToSuccess = await HowToSuccess.findById(id);

    if (!howToSuccess) {
      return res.status(404).json({
        success: false,
        message: "How To Success not found!",
      });
    }

    // Update the database with the new fields
    await HowToSuccess.findByIdAndUpdate(
      id,
      { title, description },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "How To Success updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "An error occurred while updating the our how to success.",
    });
  }
};

export { getHowToSuccess, updateHowToSuccess };
