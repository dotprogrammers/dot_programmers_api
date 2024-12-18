import jwt from "jsonwebtoken";
import Auth from "../models/auth.modal.js";

// Login admin
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!email) missingFields.push("Email");
    if (!password) missingFields.push("Password");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `${missingFields.join(", ")} field(s) are required.`,
      });
    }

    // Check if the admin exists
    const admin = await Auth.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }

    // Validate the password
    if (admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );

    // Set the token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    // Send response excluding sensitive data
    const { userName, email: userEmail, role } = admin;
    res.status(200).json({
      success: true,
      message: "Login successful.",
      payload: { userName, email: userEmail, role, token },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred during login.",
    });
  }
};

// Logout User
const logout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred during logout.",
    });
  }
};

export { loginUser, logout };
