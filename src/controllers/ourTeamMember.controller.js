import OurTeamMember from "./../models/ourTeamMember.modal.js";

const getOurTeamMember = async (req, res) => {
  try {
    const ourTeamMember = await OurTeamMember.find();

    res.status(200).json({
      success: true,
      message: "Our Team Member data was successfully retrieved.",
      payload: ourTeamMember,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOurTeamMember = async (req, res) => {
  try {
    const { id, title, description } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid our team member ID!",
      });
    }

    // Fetch the current our team member data
    const ourTeamMember = await OurTeamMember.findById(id);

    if (!ourTeamMember) {
      return res.status(404).json({
        success: false,
        message: "Our Team Member not found!",
      });
    }

    // Update the database with the new fields
    await OurTeamMember.findByIdAndUpdate(
      id,
      { title, description },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Our Team Member updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "An error occurred while updating the our team member.",
    });
  }
};

export { getOurTeamMember, updateOurTeamMember };
