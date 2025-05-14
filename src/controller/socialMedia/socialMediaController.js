const SocialMedia = require("../../model/socialMedia/socialMediaModel");

exports.addSocialMedia = async (req, res) => {
  try {
    const { name, className, link } = req.body;

    const isSocialMediaExist = await SocialMedia.findOne({ name });
    if (isSocialMediaExist) {
      return res.status(400).json({
        message: "SocialMedia is already exists",
        status: 400,
        success: false,
      });
    }

    const newData = await new SocialMedia({
      name,
      className,
      link,
    });

    const result = await newData.save();

    if (result) {
      return res.status(200).json({
        message: "SocialMedia added successfully",
        data: result,
        success: true,
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Failed to create SocialMedia",
        success: false,
        status: 400,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internl Server Error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.getAllSocialMedia = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;
    const result = await SocialMedia.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await SocialMedia.countDocuments();
    if (result) {
      return res.status(200).json({
        message: "User SocialMedia fetched",
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
      message: "Internal server error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.updateSocialMedia = async (req, res) => {
  try {
    const { name, className, link } = req.body;
    const { id } = req.params;

    const existingSocialMedia = await SocialMedia.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingSocialMedia && existingSocialMedia._id.toString() !== id) {
      return res.status(400).json({
        message: "User SocialMedia with this name already exists",
        status: 400,
        success: false,
      });
    }

    let isSocialMediaExist = await SocialMedia.findById(id);
    if (!isSocialMediaExist) {
      return res.status(400).json({
        message: "SocialMedia is not exists",
        status: 400,
        success: false,
      });
    }

    if (name) isSocialMediaExist.name = name;
    if (className) isSocialMediaExist.className = className;
    if (link) isSocialMediaExist.link = link;

    const result = await isSocialMediaExist.save();

    if (result) {
      return res.status(200).json({
        message: "SocialMedia updated successfully",
        data: result,
        success: true,
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Failed to update SocialMedia",
        success: false,
        status: 400,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internl Server Error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.deleteSocialMedia = async (req, res) => {
  try {
    const { id } = req.params;

    let isSocialMediaExist = await SocialMedia.findById(id);
    if (!isSocialMediaExist) {
      return res.status(400).json({
        message: "SocialMedia is not exists",
        status: 400,
        success: false,
      });
    }

    const result = await SocialMedia.findByIdAndDelete(id);
    if (result) {
      return res.status(200).json({
        message: "SocialMedia deleted successfully!",
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
      message: "Internal server error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.updateSocialMediaStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const isSocialMediaExist = await SocialMedia.findById(id);
    if (!isSocialMediaExist) {
      return res.status(400).json({
        message: "SocialMedia does not exist",
        status: 400,
        success: false,
      });
    }

    const updatedStatus = !isSocialMediaExist.status;

    const result = await SocialMedia.findByIdAndUpdate(
      id,
      { status: updatedStatus },
      { new: true }
    );
    if (result) {
      return res.status(200).json({
        message: "SocialMedia status updated successfully!",
        id,
        data: result,
        status: 200,
        success: true,
      });
    } else {
      return res.status(500).json({
        message: "Error updating user SocialMedia",
        status: 500,
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};
