import OurTechnology from "./../models/ourTechnology.modal.js";

const getOurTechnology = async (req, res) => {
  try {
    const ourTechnology = await OurTechnology.find();

    res.status(200).json({
      success: true,
      message: "Our Technology data was successfully retrieved.",
      payload: ourTechnology,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOurTechonolgy = async (req, res) => {
  try {
    const { id, title, description } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid our technology ID!",
      });
    }

    // Fetch the current our technology data
    const ourTechnology = await OurTechnology.findById(id);

    if (!ourTechnology) {
      return res.status(404).json({
        success: false,
        message: "Our Technology not found!",
      });
    }

    // Update the database with the new fields
    await OurTechnology.findByIdAndUpdate(
      id,
      { title, description },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Our Technology updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the our technology.",
    });
  }
};

export { getOurTechnology, updateOurTechonolgy };
