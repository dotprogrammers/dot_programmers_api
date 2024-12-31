import nodemailer from "nodemailer";
import decrypt from "../middlewares/decrypt.js";
import Contact from "../models/contact.modal.js";
import EmailConfiguration from "../models/emailConfigurationModal.js";

const getContactuser = async (req, res) => {
  try {
    const contactUser = await Contact.find();

    res.status(200).json({
      success: true,
      message: "Contact User data was successfully retrieved.",
      payload: contactUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const storeContactUser = async (req, res) => {
  const { name, phoneNumber, email, subject, message } = req.body;

  // Validate email
  if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  // Validate required fields
  const missingFields = [];
  if (!name) missingFields.push("Name");
  if (!phoneNumber) missingFields.push("Phone Number");
  if (!subject) missingFields.push("Subject");
  if (!message) missingFields.push("Message");

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `${missingFields.join(", ")} field(s) are required.`,
    });
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

    // Encrypt the password
    const decryptedPassword = decrypt(emailPassword);
    if (!decryptedPassword) {
      return res.status(500).json({
        success: false,
        message: "Failed to decrypt email password",
      });
    }

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
      subject: "Contact Us Confirmation",
      text: "Thank you for sharing your awesome idea!",
      // Optionally add an HTML version of the message
      html: `<p>Thank you for sharing your awesome idea, ${name}!</p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Save the contact data to the database
    const newContactUser = new Contact({
      name,
      phoneNumber,
      email,
      subject,
      message,
    });
    await newContactUser.save();

    // Respond with success
    res.status(200).json({ success: true, message: "Contact us successful!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "An error occurred while processing the contact request.",
    });
  }
};

export { getContactuser, storeContactUser };
