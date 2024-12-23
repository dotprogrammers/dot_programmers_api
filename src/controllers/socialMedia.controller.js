import SocialMedia from "./../models/socialMedia.modal.js";

const getSocialMedia = async (req, res) => {
  try {
    const socialMedia = await SocialMedia.find();

    res.status(200).json({
      success: true,
      message: "Social media data was successfully retrieved.",
      payload: socialMedia,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSocialMedia = async (req, res) => {
  try {
    const {
      id,
      facebookLink,
      twitterLink,
      instagramLink,
      linkedinLink,
      youtubeLink,
      whatsappNumber,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid social media ID!",
      });
    }

    // Fetch the current social media data
    const socialMedia = await SocialMedia.findById(id);

    if (!socialMedia) {
      return res.status(404).json({
        success: false,
        message: "Social media not found!",
      });
    }

    // Update the database with the new fields
    await SocialMedia.findByIdAndUpdate(
      id,
      {
        facebookLink,
        twitterLink,
        instagramLink,
        linkedinLink,
        youtubeLink,
        whatsappNumber,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Social media updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the social media.",
    });
  }
};

export { getSocialMedia, updateSocialMedia };
