const Banner = require("../../model/banner/bannerModel");
const {
  uploadImageOnAwsReturnUrl,
} = require("../../utils/functions/uploadFilesOnAws");
const mongoose = require("mongoose");

exports.addBanner = async (req, res) => {
  try {
    const { title, description, banner_img, type } = req.body;
    const file = req.files?.banner_img?.[0];

    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
        success: false,
        status: 400,
      });
    }

    const BannerData = await Banner.findOne({ type: type });

    if (BannerData) {
      return res.status(400).json({
        message: "banner post already exist.",
        status: 400,
        success: false,
      });
    }

    let bannerImage = null;
    if (banner_img) {
      bannerImage = banner_img;
    } else if (file) {
      bannerImage = await uploadImageOnAwsReturnUrl(file);
    }

    const newBanner = new Banner({
      title,
      description,
      type,
      imageUrl: bannerImage,
    });

    const bannerResult = await newBanner.save();

    if (!bannerResult) {
      return res.status(400).json({
        message: "Failed to add banner",
        status: 400,
        success: false,
      });
    }

    return res.status(200).json({
      message: "banner added successfully",
      data: bannerResult,
      status: 200,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.getAllBanner = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const bannerResult = await Banner.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Banner.countDocuments();

    if (bannerResult) {
      return res.status(200).json({
        message: "banner post retrieved successfully",
        status: 200,
        success: true,
        data: bannerResult,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.getBannerById = async (req, res) => {
  try {
    const BannerId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(BannerId)) {
      return res.status(400).json({
        message: "Invalid banner post ID",
        status: 400,
        success: false,
      });
    }

    const bannerResult = await Banner.findById(BannerId);

    if (!bannerResult) {
      return res.status(404).json({
        message: "banner post not found",
        status: 404,
        success: false,
      });
    }

    return res.status(200).json({
      message: "banner post retrieved successfully",
      data: bannerResult,
      status: 200,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const BannerId = req.params.id;
    const { title, description, banner_img, type } = req.body;

    const BannerData = await Banner.findById(BannerId);

    if (!BannerData) {
      return res.status(404).json({
        message: "banner post not found",
        status: 404,
        success: false,
      });
    }

    let bannerImage = null;
    if (banner_img) {
      bannerImage = banner_img;
    } else {
      const file = req.files?.banner_img?.[0];
      bannerImage = await uploadImageOnAwsReturnUrl(file);
    }

    const updateData = {
      title,
      description,
      type,
      imageUrl: bannerImage,
    };

    const updatedBanner = await Banner.findByIdAndUpdate(BannerId, updateData, {
      new: true,
      runValidators: true,
    });

    if (updatedBanner) {
      return res.status(200).json({
        message: "banner post updated successfully",
        status: 200,
        success: true,
        data: updatedBanner,
        id: BannerId,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const BannerId = req.params.id;
    const Banner = await Banner.findById(BannerId);
    if (!Banner) {
      return res.status(404).json({
        message: "banner post not found",
        status: 404,
        success: false,
      });
    }
    await Banner.findByIdAndDelete(BannerId);
    return res.status(200).json({
      message: "banner post deleted successfully",
      status: 200,
      success: true,
      data: Banner,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.updateBannerStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const BannerData = await Banner.findById(id);

    if (!BannerData) {
      return res.status(404).json({
        message: "banner post not found",
        status: 404,
        success: false,
      });
    }

    const updatedStatus = !BannerData.status;
    const result = await Banner.findByIdAndUpdate(
      id,
      { status: updatedStatus },
      { new: true }
    );
    if (result) {
      return res.status(200).json({
        message: "banner post status updated successfully",
        id: id,
        status: 200,
        success: true,
        data: result,
      });
    } else {
      return res.status(500).json({
        message: "Error updating banner",
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

// For User
exports.getBannerByTypeForUser = async (req, res) => {
  try {
    const { type } = req.query;
    const BannerData = await Banner.findOne({ type: type, status: true });
    if (BannerData) {
      return res.status(200).json({
        message: "banner post retrieved successfully",
        status: 200,
        success: true,
        data: BannerData,
      });
    } else {
      return res.status(404).json({
        message: "banner post not found",
        status: 404,
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server error",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};
