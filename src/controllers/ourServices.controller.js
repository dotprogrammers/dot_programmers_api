import OurServices from "./../models/ourServices.modal.js";

const getOurServices = async (req, res) => {
  try {
    const ourServices = await OurServices.find();

    res.status(200).json({
      success: true,
      message: "Our Service data was successfully retrieved.",
      payload: ourServices,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOurServices = async (req, res) => {
  try {
    const { id, title, description } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid our services ID!",
      });
    }

    // Fetch the current ourServices data
    const ourServices = await OurServices.findById(id);

    if (!ourServices) {
      return res.status(404).json({
        success: false,
        message: "Our Services not found!",
      });
    }

    // Update the database with the new fields
    await OurServices.findByIdAndUpdate(
      id,
      { title, description },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Our Services updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the our services.",
    });
  }
};

export { getOurServices, updateOurServices };
