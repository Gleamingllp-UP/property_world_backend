const AboutUs = require("../../model/aboutus/aboutUsModel");
const {
  uploadImageOnAwsReturnUrl,
} = require("../../utils/functions/uploadFilesOnAws");

exports.addAboutUs = async (req, res) => {
  try {
    const {
      profileHeading,
      profileDesc,
      visionHeading,
      visionDesc,
      missionHeading,
      missionDesc,
    } = req.body;

    const isAboutUsExist = await AboutUs.find();
    if (isAboutUsExist?.length > 0) {
      return res.status(400).json({
        message: "AboutUs already exists",
        status: 400,
        success: false,
      });
    }

    if (!req.files.profile || !req.files.vision || !req.files.mission) {
      return res.status(400).json({
        message: "All 3 images are required",
        status: 400,
        success: false,
      });
    }

    const profileFile = req.files?.profile?.[0];
    const visionFile = req.files?.vision?.[0];
    const visionBgFile = req.files?.visionBg?.[0];
    const missionFile = req.files?.mission?.[0];

    const profileImageUrl = profileFile
      ? await uploadImageOnAwsReturnUrl(profileFile)
      : null;

    const visionImageUrl = visionFile
      ? await uploadImageOnAwsReturnUrl(visionFile)
      : null;

    const visionBgImageUrl = visionBgFile
      ? await uploadImageOnAwsReturnUrl(visionBgFile)
      : null;

    const missionImageUrl = missionFile
      ? await uploadImageOnAwsReturnUrl(missionFile)
      : null;

    const newAboutUs = new AboutUs({
      profile: {
        heading: profileHeading,
        description: profileDesc,
        imageUrl: profileImageUrl,
      },
      vision: {
        heading: visionHeading,
        description: visionDesc,
        imageUrl: visionImageUrl,
        backgroundImageUrl: visionBgImageUrl || "",
      },
      mission: {
        heading: missionHeading,
        description: missionDesc,
        imageUrl: missionImageUrl,
      },
    });

    const result = await newAboutUs.save();

    if (result) {
      return res.status(200).json({
        message: "AboutUs added successfully",
        data: result,
        success: true,
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Failed to create AboutUs",
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

exports.getAllAboutUs = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const result = await AboutUs.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await AboutUs.countDocuments();

    if (result) {
      return res.status(200).json({
        message: "AboutUss fetched successfully",
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

exports.updateAboutUs = async (req, res) => {
  try {
    const {
      profileHeading,
      profileDesc,
      visionHeading,
      visionDesc,
      missionHeading,
      missionDesc,
      profile,
      vision,
      visionBg,
      mission,
    } = req.body;

    const { id } = req.params;

    const isAboutUsExist = await AboutUs.findById(id);
    if (!isAboutUsExist) {
      return res.status(400).json({
        message: "AboutUs does not exist",
        status: 400,
        success: false,
      });
    }

    const profileFile = req.files?.profile?.[0];
    const visionFile = req.files?.vision?.[0];
    const visionBgFile = req.files?.visionBg?.[0];
    const missionFile = req.files?.mission?.[0];

    const profileImageUrl = profileFile
      ? await uploadImageOnAwsReturnUrl(profileFile)
      : profile;

    const visionImageUrl = visionFile
      ? await uploadImageOnAwsReturnUrl(visionFile)
      : vision;

    const visionBgImageUrl = visionBgFile
      ? await uploadImageOnAwsReturnUrl(visionBgFile)
      : visionBg;

    const missionImageUrl = missionFile
      ? await uploadImageOnAwsReturnUrl(missionFile)
      : mission;

    if (profileHeading) isAboutUsExist.profile.heading = profileHeading;
    if (profileDesc) isAboutUsExist.profile.description = profileDesc;
    if (profileImageUrl) isAboutUsExist.profile.imageUrl = profileImageUrl;

    if (visionHeading) isAboutUsExist.vision.heading = visionHeading;
    if (visionDesc) isAboutUsExist.vision.description = visionDesc;
    if (visionImageUrl) isAboutUsExist.vision.imageUrl = visionImageUrl;
    if (visionBgImageUrl)
      isAboutUsExist.vision.backgroundImageUrl = visionBgImageUrl;

    if (missionHeading) isAboutUsExist.mission.heading = missionHeading;
    if (missionDesc) isAboutUsExist.mission.description = missionDesc;
    if (missionImageUrl) isAboutUsExist.mission.imageUrl = missionImageUrl;

    const result = await isAboutUsExist.save();

    if (result) {
      return res.status(200).json({
        message: "AboutUs updated successfully",
        data: result,
        success: true,
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Failed to update AboutUs",
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

exports.deleteAboutUs = async (req, res) => {
  try {
    const { id } = req.params;

    const isAboutUsExist = await AboutUs.findById(id);
    if (!isAboutUsExist) {
      return res.status(400).json({
        message: "AboutUs does not exist",
        status: 400,
        success: false,
      });
    }

    const result = await AboutUs.findByIdAndDelete(id);
    if (result) {
      return res.status(200).json({
        message: "AboutUs deleted successfully!",
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

exports.updateAboutUsStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const isAboutUsExist = await AboutUs.findById(id);
    if (!isAboutUsExist) {
      return res.status(400).json({
        message: "AboutUs does not exist",
        status: 400,
        success: false,
      });
    }

    const updatedStatus = !isAboutUsExist.status;

    const result = await AboutUs.findByIdAndUpdate(
      id,
      { status: updatedStatus },
      { new: true }
    );

    if (result) {
      return res.status(200).json({
        message: "AboutUs status updated successfully!",
        id,
        data: result,
        status: 200,
        success: true,
      });
    } else {
      return res.status(500).json({
        message: "Error updating AboutUs status",
        status: 500,
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
