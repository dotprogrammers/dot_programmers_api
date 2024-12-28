import OurTestimonial from "../models/ourTestimonial.modal.js";

const getOurTestimonial = async (req, res) => {
  try {
    const ourTestimonial = await OurTestimonial.find();

    res.status(200).json({
      success: true,
      message: "Our Testimonial data was successfully retrieved.",
      payload: ourTestimonial,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOurTestimonial = async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      totalClientCount,
      totalProjectCount,
      totalReviewCount,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid our testimonial ID!",
      });
    }

    // Fetch the current our testimonial data
    const ourTestimonial = await OurTestimonial.findById(id);

    if (!ourTestimonial) {
      return res.status(404).json({
        success: false,
        message: "Our Testimonial not found!",
      });
    }

    // Update the database with the new fields
    await OurTestimonial.findByIdAndUpdate(
      id,
      {
        title,
        description,
        totalClientCount,
        totalProjectCount,
        totalReviewCount,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Our Testimonial updated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message ||
        "An error occurred while updating the our testimonial.",
    });
  }
};

export { getOurTestimonial, updateOurTestimonial };
