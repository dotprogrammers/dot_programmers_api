import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import TeamMember from "../models/teamMember.model.js";

// Define __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    const image = process.env.APP_URL + "/images/" + req.file.filename;

    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push("Name");
    if (!designation) missingFields.push("Designation");
    if (!whatsappNumber) missingFields.push("Whatsapp Number");
    if (!image) missingFields.push("Member Image");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `${missingFields.join(", ")} field(s) are required.`,
      });
    }

    // Create a new member document
    const newTeamMember = new TeamMember({
      name,
      designation,
      facebookLink,
      linkedinLink,
      whatsappNumber,
      image: image,
      status: 1,
    });

    // Save to database
    await newTeamMember.save();

    res.status(201).json({
      success: true,
      message: "Member added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add member",
    });
  }
};

const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Please provide member id!",
      });
    }
    const teamMember = await TeamMember.findByIdAndDelete(id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found.",
      });
    }

    // Optionally, delete the image file when deleting the member
    if (teamMember.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        "images",
        path.basename(teamMember.image)
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    res.json({ success: true, message: "Member deleted successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while deleting the member.",
    });
  }
};

const updateTeamMember = async (req, res) => {
  try {
    const { id, image, ...otherFields } = req.body;

    const images = req.file
      ? process.env.APP_URL + "/images/" + req.file.filename
      : null;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide member id!",
      });
    }

    // Fetch the current member data
    const teamMember = await TeamMember.findById(id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found!",
      });
    }

    // Update only the provided fields
    let updatedFields = {
      image: images && images,
      ...otherFields,
    };

    if (images) {
      // Delete the old image file when updating the member
      if (teamMember.image) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "images",
          path.basename(teamMember.image)
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updatedFields = {
        image: images && images,
        ...otherFields,
      };
    } else {
      updatedFields = {
        ...otherFields,
      };
    }

    await TeamMember.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Member updated successfully.",
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
