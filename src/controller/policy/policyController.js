const Policy = require("../../model/policy/policyModel");

exports.addPolicy = async (req, res) => {
  try {
    const { title, short_description, long_description, type } = req.body;

    const isPolicyExist = await Policy.findOne({ type: type });
    if (isPolicyExist) {
      return res
        .status(400)
        .json({ message: "Policy already exist", status: 400, success: false });
    }
    const newPolicy = new Policy({
      title,
      short_description,
      long_description,
      type,
    });

    const result = await newPolicy.save();

    if (result) {
      return res.status(201).json({
        message: "Policy created successfully",
        status: 201,
        success: true,
        data: result,
      });
    } else {
      return res.status(500).json({
        message: "Failed to create policy",
        status: 500,
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Inernal server error!",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.getPolicyByType = async (req, res) => {
  try {
    const { type } = req.query;

    const policy = await Policy.findOne({ type: type });

      return res.status(200).json({
        message: "Policy Fetched",
        status: 200,
        success: true,
        data: policy || null
      });
   
  } catch (error) {
    return res.status(500).json({
      message: "Inernal server error!",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.updatePolicy = async (req, res) => {
  try {
    const { title, short_description, long_description, type } = req.body;
    const { id } = req.params;

    const isPolicyExist = await Policy.findById(id);

    if (!isPolicyExist) {
      return res.status(404).json({
        message: "Policy not found",
        status: 404,
        success: false,
      });
    }
    const policy = await Policy.findByIdAndUpdate(
      id,
      {
        title: title,
        short_description: short_description,
        long_description: long_description,
        type: type,
      },
      { new: true }
    );
    if (policy) {
      return res.status(200).json({
        message: "Policy updated successfully",
        status: 200,
        success: true,
        data: policy,
      });
    } else {
      return res.status(400).json({
        message: "Failed to update Policy",
        status: 404,
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Inernal server error!",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const isPolicyExist = await Policy.findById(id);
    if (!isPolicyExist) {
      return res.status(404).json({
        message: "Policy not found",
        status: 404,
        success: false,
      });
    }
    const policy = await Policy.findByIdAndDelete(id);
    if (policy) {
      return res.status(200).json({
        message: "Policy deleted successfully",
        status: 200,
        success: true,
        data: policy,
      });
    } else {
      return res.status(400).json({
        message: "Failed to delete Policy",
        status: 404,
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Inernal server error!",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};

exports.getPolicyByTypeForUser = async (req, res) => {
  try {
    const { type } = req.query;

    const policy = await Policy.findOne({ type: type });

      return res.status(200).json({
        message: "Policy Fetched",
        status: 200,
        success: true,
        data: policy || null
      });
   
  } catch (error) {
    return res.status(500).json({
      message: "Inernal server error!",
      error: error?.message,
      status: 500,
      success: false,
    });
  }
};