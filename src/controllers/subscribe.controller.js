import nodemailer from "nodemailer";
import decrypt from "../middlewares/decrypt.js";
import Subscribe from "../models/subscribe.modal.js";
import EmailConfiguration from "./../models/emailConfigurationModal.js";

const getSubscribeUser = async (req, res) => {
  try {
    const subscribeUser = await Subscribe.find();

    res.status(200).json({
      success: true,
      message: "Subscribe User data was successfully retrieved.",
      payload: subscribeUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const storeSubscribeUser = async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    // Query email configuration from the database
    const emailConfig = await EmailConfiguration.findOne();
    if (!emailConfig) {
      return res.status(500).json({
        success: false,
        message: "Email configuration not found",
      });
    }

    const {
      emailUserName,
      emailPassword,
      emailHost,
      emailPort,
      emailFromName,
    } = emailConfig;

    const checkAlreadyExists = await Subscribe.find({ email });
    if (checkAlreadyExists.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Encrypt the password
    const decryptedPassword = decrypt(emailPassword);

    // Send confirmation email using dynamic configuration
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailConfig.emailEncryption.includes("ssl"),
      auth: {
        user: emailUserName,
        pass: decryptedPassword,
      },
    });

    const mailOptions = {
      from: `${emailFromName} <${emailUserName}>`,
      to: email,
      subject: "Subscription Confirmation",
      text: "Thank you for subscribing to our newsletter!",
    };

    await transporter.sendMail(mailOptions);
    // Save email to database
    const newSubscribeUser = new Subscribe({ email });
    await newSubscribeUser.save();

    res
      .status(200)
      .json({ success: true, message: "Subscription successful!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the contact us.",
    });
  }
};

export { getSubscribeUser, storeSubscribeUser };
