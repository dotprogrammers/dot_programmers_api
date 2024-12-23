import cloudinary from "../config/cloudinary.config.js";
import LogoAndFavicon from "../models/logoAndFavicon.modal.js";

const getLogoAndFavicon = async (req, res) => {
  try {
    const logoAndFavicon = await LogoAndFavicon.find();

    res.status(200).json({
      success: true,
      message: "Logo and favicon data was successfully retrieved.",
      payload: logoAndFavicon,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateLogoAndFavicon = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid logo and favicon ID!",
      });
    }

    // Fetch the current site configuration data
    const logoAndFavicon = await LogoAndFavicon.findById(id);

    if (!logoAndFavicon) {
      return res.status(404).json({
        success: false,
        message: "Logo and favicon not found!",
      });
    }
    // Handle file uploads to Cloudinary
    const updatedFields = {};
    if (req.files.logoLink) {
      // Delete the previous image from Cloudinary
      if (logoAndFavicon.logoPublicId) {
        await cloudinary.uploader.destroy(logoAndFavicon.logoPublicId);
      }

      const logoFile = req.files.logoLink[0];
      const logoResult = await cloudinary.uploader.upload(logoFile.path, {
        folder: "dot_programmer",
      });
      updatedFields.logoLink = logoResult.secure_url;
      updatedFields.logoPublicId = logoResult.public_id;
    }

    if (req.files.faviconLink) {
      // Delete the previous image from Cloudinary
      if (logoAndFavicon.faviconPublicId) {
        await cloudinary.uploader.destroy(logoAndFavicon.faviconPublicId);
      }

      const faviconFile = req.files.faviconLink[0];
      const faviconResult = await cloudinary.uploader.upload(faviconFile.path, {
        folder: "dot_programmer",
      });
      updatedFields.faviconLink = faviconResult.secure_url;
      updatedFields.faviconPublicId = faviconResult.public_id;
    }

    // Update database
    const updatedLogoAndFavicon = await LogoAndFavicon.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Logo and favicon updated successfully!",
      payload: updatedLogoAndFavicon,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export { getLogoAndFavicon, updateLogoAndFavicon };
