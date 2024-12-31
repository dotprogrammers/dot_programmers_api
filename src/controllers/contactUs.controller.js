import ContactUs from "./../models/contactUs.modal.js";

const getContactUs = async (req, res) => {
  try {
    const contactUs = await ContactUs.find();

    res.status(200).json({
      success: true,
      message: "Contact Us data was successfully retrieved.",
      payload: contactUs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateContactUs = async (req, res) => {
  try {
    const { id, title, description } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid contact us ID!",
      });
    }

    // Fetch the current our contact us data
    const contactUs = await ContactUs.findById(id);

    if (!contactUs) {
      return res.status(404).json({
        success: false,
        message: "Contact Us not found!",
      });
    }

    // Update the database with the new fields
    await ContactUs.findByIdAndUpdate(
      id,
      { title, description },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Contact Us updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the contact us.",
    });
  }
};

export { getContactUs, updateContactUs };
