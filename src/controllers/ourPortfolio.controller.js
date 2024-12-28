import OurPortfolio from "../models/ourPortfolio.modal.js";

const getOurPortfolio = async (req, res) => {
  try {
    const ourPortfolio = await OurPortfolio.find();

    res.status(200).json({
      success: true,
      message: "Our Portfolio data was successfully retrieved.",
      payload: ourPortfolio,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOurPortfolio = async (req, res) => {
  try {
    const { id, title, description } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid our portfolio ID!",
      });
    }

    // Fetch the current our portfolio data
    const ourPortfolio = await OurPortfolio.findById(id);

    if (!ourPortfolio) {
      return res.status(404).json({
        success: false,
        message: "Our Portfolio not found!",
      });
    }

    // Update the database with the new fields
    await OurPortfolio.findByIdAndUpdate(
      id,
      { title, description },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Our Portfolio updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the our portfolio.",
    });
  }
};

export { getOurPortfolio, updateOurPortfolio };
