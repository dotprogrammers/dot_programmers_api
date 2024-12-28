import Consultation from "../models/consultation.modal.js";

const getConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.find();

    res.status(200).json({
      success: true,
      message: "Consultation data was successfully retrieved.",
      payload: consultation,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateConsultation = async (req, res) => {
  try {
    const { id, title, description } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid consultation ID!",
      });
    }

    // Fetch the current consultation data
    const consultation = await Consultation.findById(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found!",
      });
    }

    // Update the database with the new fields
    await Consultation.findByIdAndUpdate(
      id,
      { title, description },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Consultation updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the consultation.",
    });
  }
};

export { getConsultation, updateConsultation };
