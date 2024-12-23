import fs from "fs";
import cloudinary from "../config/cloudinary.config.js";
import TeamMember from "../models/teamMember.model.js";

const getTeamMembers = async (req, res) => {
  try {
    const { skip, limit } = req.pagination;
    let query = {};
    if (req.headers["x-source"] === "admin") {
      query = {};
    } else if (req.headers["x-source"] === "frontend") {
      query = { status: 1 };
    }
    const teamMembers = await TeamMember.find(query).skip(skip).limit(limit);
    const totalDataCount = await TeamMember.countDocuments();

    res.status(200).json({
      success: true,
      payload: teamMembers,
      pagination: {
        totalData: totalDataCount,
        totalPages: Math.ceil(totalDataCount / limit),
        currentPage: req.pagination.page,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addTeamMember = async (req, res) => {
  try {
    const { name, designation, facebookLink, linkedinLink, whatsappNumber } =
      req.body;

    // Ensure file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Member Image is required.",
      });
    }

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push("Name");
    if (!designation) missingFields.push("Designation");
    if (!whatsappNumber) missingFields.push("Whatsapp Number");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `${missingFields.join(", ")} field(s) are required.`,
      });
    }

    // Upload to Cloudinary
    const imagePath = req.file.path; // Path of the file on the server
    let cloudinaryResult;

    try {
      cloudinaryResult = await cloudinary.uploader.upload(imagePath, {
        folder: "dot_programmer",
      });
    } catch (uploadError) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to Cloudinary",
        error: uploadError.message,
      });
    }

    // Delete the image from the server after successful upload
    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (deleteError) {
      console.error("Error deleting file from server:", deleteError.message);
    }

    // Save the team member to the database
    const newTeamMember = new TeamMember({
      name,
      designation,
      facebookLink,
      linkedinLink,
      whatsappNumber,
      image: cloudinaryResult.secure_url,
      imagePublicId: cloudinaryResult.public_id,
      status: 1,
    });

    await newTeamMember.save();

    res.status(201).json({
      success: true,
      message: "Member added successfully",
      data: newTeamMember,
    });
  } catch (error) {
    console.error("Error adding team member:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add member",
      error: error.message,
    });
  }
};
const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide member ID!",
      });
    }

    // Find the member to delete
    const teamMember = await TeamMember.findById(id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    // Delete the image from Cloudinary
    if (teamMember.image) {
      const publicId = teamMember.imagePublicId;

      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error(
          "Error deleting image from Cloudinary:",
          cloudinaryError.message
        );
        return res.status(500).json({
          success: false,
          message: "Failed to delete image from Cloudinary.",
          error: cloudinaryError.message,
        });
      }
    }

    // Delete the member from the database
    await TeamMember.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Member deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while deleting the service.",
    });
  }
};

const updateTeamMember = async (req, res) => {
  try {
    const { id, ...otherFields } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid member ID!",
      });
    }

    // Fetch the current member data
    const teamMember = await TeamMember.findById(id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team member not found!",
      });
    }

    // Handle image update if a new file is provided
    let updatedFields = { ...otherFields };

    if (req.file) {
      try {
        // Delete the previous image from Cloudinary
        if (teamMember.imagePublicId) {
          await cloudinary.uploader.destroy(teamMember.imagePublicId);
        }

        // Upload the new image to Cloudinary
        const cloudinaryResult = await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: "dot_programmer",
          }
        );

        // Add the new image data to updated fields
        updatedFields.image = cloudinaryResult.secure_url;
        updatedFields.imagePublicId = cloudinaryResult.public_id;
      } catch (imageError) {
        return res.status(500).json({
          success: false,
          message: "Image update failed.",
          error: imageError.message,
        });
      }
    }


    // Delete the image from the server after successful upload
    try {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (deleteError) {
      console.error("Error deleting file from server:", deleteError.message);
    }

    // Update the database with the new fields
    const updatedMember = await TeamMember.findByIdAndUpdate(
      id,
      updatedFields,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Team member updated successfully.",
      data: updatedMember,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating the member.",
    });
  }
};

const viewTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Please provide member id!",
      });
    }
    const teamMemer = await TeamMember.findById(id);

    if (!teamMemer) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Member found.", payload: teamMemer });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while viewing the member.",
    });
  }
};
export {
  addTeamMember,
  deleteTeamMember,
  getTeamMembers,
  updateTeamMember,
  viewTeamMember,
};
