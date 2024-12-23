import ContactInfo from "./../models/contactInfo.modal.js";

const getContactInfo = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.find();

    res.status(200).json({
      success: true,
      message: "Contact info data was successfully retrieved.",
      payload: contactInfo,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateContactInfo = async (req, res) => {
  try {
    const {
      id,
      phoneNumberFirst,
      phoneNumberSecond,
      emailAddressFirst,
      emailAddressSecond,
      contactAddress,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid contact info ID!",
      });
    }

    // Fetch the current contact info data
    const contactInfo = await ContactInfo.findById(id);

    if (!contactInfo) {
      return res.status(404).json({
        success: false,
        message: "Contact info not found!",
      });
    }

    // Update the database with the new fields
    await ContactInfo.findByIdAndUpdate(
      id,
      {
        phoneNumberFirst,
        phoneNumberSecond,
        emailAddressFirst,
        emailAddressSecond,
        contactAddress,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Contact info updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the contact info.",
    });
  }
};

export { getContactInfo, updateContactInfo };
