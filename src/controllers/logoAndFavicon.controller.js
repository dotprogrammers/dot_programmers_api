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

    if (req.files) {
      try {
        const cloudinaryResult = req.files;
        const logoFile = cloudinaryResult.logoLink
          ? cloudinaryResult.logoLink[0]
          : null;
        const faviconFile = cloudinaryResult.faviconLink
          ? cloudinaryResult.faviconLink[0]
          : null;

        // Handle logo update
        if (logoFile) {
          if (data.logoPublicId) {
            await cloudinary.uploader.destroy(data.logoPublicId); // Delete old image
          }
          updatedFields.logoLink = logoFile.path; // Cloudinary URL for the image
          updatedFields.logoPublicId = logoFile.filename; // Cloudinary public ID
        }

        // Handle favicon update
        if (faviconFile) {
          if (data.faviconPublicId) {
            await cloudinary.uploader.destroy(data.faviconPublicId); // Delete old logo
          }
          updatedFields.faviconLink = faviconFile.path; // Cloudinary URL for the logo
          updatedFields.faviconPublicId = faviconFile.filename; // Cloudinary public ID
        }
      } catch (imageError) {
        return res.status(500).json({
          success: false,
          message: "File upload failed.",
          error: imageError.message,
        });
      }
    }

    // if (req.files.logoLink) {
    //   // Delete the previous image from Cloudinary
    //   if (logoAndFavicon.logoPublicId) {
    //     await cloudinary.uploader.destroy(logoAndFavicon.logoPublicId);
    //   }

    //   const logoFile = req.files.logoLink[0];
    //   const logoResult = await cloudinary.uploader.upload(logoFile.path, {
    //     folder: "dot_programmer",
    //   });
    //   updatedFields.logoLink = logoResult.secure_url;
    //   updatedFields.logoPublicId = logoResult.public_id;

    //   try {
    //     if (fs.existsSync(req.files.logoLink[0].path)) {
    //       fs.unlinkSync(req.files.logoLink[0].path);
    //     }
    //   } catch (deleteError) {
    //     console.error("Error deleting file from server:", deleteError.message);
    //   }
    // }

    // if (req.files.faviconLink) {
    //   // Delete the previous image from Cloudinary
    //   if (logoAndFavicon.faviconPublicId) {
    //     await cloudinary.uploader.destroy(logoAndFavicon.faviconPublicId);
    //   }

    //   const faviconFile = req.files.faviconLink[0];
    //   const faviconResult = await cloudinary.uploader.upload(faviconFile.path, {
    //     folder: "dot_programmer",
    //   });
    //   updatedFields.faviconLink = faviconResult.secure_url;
    //   updatedFields.faviconPublicId = faviconResult.public_id;

    //   try {
    //     if (fs.existsSync(req.files.faviconLink[0].path)) {
    //       fs.unlinkSync(req.files.faviconLink[0].path);
    //     }
    //   } catch (deleteError) {
    //     console.error("Error deleting file from server:", deleteError.message);
    //   }
    // }

    // Update database
    await LogoAndFavicon.findByIdAndUpdate(id, updatedFields, { new: true });

    res.status(200).json({
      success: true,
      message: "Logo and favicon updated successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getLogoAndFavicon, updateLogoAndFavicon };
