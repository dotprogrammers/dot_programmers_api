import SiteConfiguration from "../models/siteConfiguration.model.js";

const getSiteConfiguration = async (req, res) => {
  try {
    const siteConfiguration = await SiteConfiguration.find();

    res.status(200).json({
      success: true,
      message: "Site configuration data was successfully retrieved.",
      payload: siteConfiguration,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSiteConfiguration = async (req, res) => {
  try {
    const { id, title, description } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid site configuration ID!",
      });
    }

    // Fetch the current site configuration data
    const siteConfiguration = await SiteConfiguration.findById(id);

    if (!siteConfiguration) {
      return res.status(404).json({
        success: false,
        message: "Site configuration not found!",
      });
    }

    // Update the database with the new fields
    await SiteConfiguration.findByIdAndUpdate(
      id,
      { title, description },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Site configuration updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "An error occurred while updating the site configuration.",
    });
  }
};

export { getSiteConfiguration, updateSiteConfiguration };
