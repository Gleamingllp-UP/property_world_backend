const ContactUs = require("../../model/contactUs/contactUsModel");
const {
  uploadImageOnAwsReturnUrl,
} = require("../../utils/functions/uploadFilesOnAws");

exports.addContactUs = async (req, res) => {
  try {
    const { tele_phone, whatsapp_number, email, address, } = req.body;

    const isContactUsExist = await ContactUs.find();
    if (isContactUsExist?.length > 0) {
      return res.status(400).json({
        message: "ContactUs already exists",
        status: 400,
        success: false,
      });
    }

    if (!req.files.cover_img) {
      return res.status(400).json({
        message: "Image is required",
        status: 400,
        success: false,
      });
    }

    const coverImgFile = req.files?.cover_img?.[0];

    const coverImageUrl = coverImgFile
      ? await uploadImageOnAwsReturnUrl(coverImgFile)
      : null;

    const newContactUs = new ContactUs({
      tele_phone,
      whatsapp_number,
      email,
      address,
      coverImg: coverImageUrl,
    });

    const result = await newContactUs.save();

    if (result) {
      return res.status(200).json({
        message: "ContactUs added successfully",
        data: result,
        success: true,
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Failed to create ContactUs",
        success: false,
        status: 400,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.getAllContactUs = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const result = await ContactUs.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ContactUs.countDocuments();

    if (result) {
      return res.status(200).json({
        message: "ContactUs fetched successfully",
        data: result,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        status: 200,
        success: true,
      });
    } else {
      return res.status(404).json({
        message: "Error in database",
        status: 404,
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.updateContactUs = async (req, res) => {
  try {
    const { tele_phone, whatsapp_number, email, address, cover_img } = req.body;

    const { id } = req.params;

    const isContactUsExist = await ContactUs.findById(id);
    if (!isContactUsExist) {
      return res.status(400).json({
        message: "ContactUs does not exist",
        status: 400,
        success: false,
      });
    }
    const coverImgFile = req.files?.cover_img?.[0];

    const coverImageUrl = coverImgFile
      ? await uploadImageOnAwsReturnUrl(coverImgFile)
      : cover_img;

    if (tele_phone) isContactUsExist.tele_phone = tele_phone;
    if (whatsapp_number) isContactUsExist.whatsapp_number = whatsapp_number;
    if (email) isContactUsExist.email = email;
    if (address) isContactUsExist.address = address;

    if (coverImageUrl) isContactUsExist.coverImg = coverImageUrl;

    const result = await isContactUsExist.save();

    if (result) {
      return res.status(200).json({
        message: "ContactUs updated successfully",
        data: result,
        success: true,
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Failed to update ContactUs",
        success: false,
        status: 400,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.deleteContactUs = async (req, res) => {
  try {
    const { id } = req.params;

    const isContactUsExist = await ContactUs.findById(id);
    if (!isContactUsExist) {
      return res.status(400).json({
        message: "ContactUs does not exist",
        status: 400,
        success: false,
      });
    }

    const result = await ContactUs.findByIdAndDelete(id);
    if (result) {
      return res.status(200).json({
        message: "ContactUs deleted successfully!",
        id: id,
        data: result,
        status: 200,
        success: true,
      });
    } else {
      return res.status(404).json({
        message: "Error in database",
        status: 404,
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};


