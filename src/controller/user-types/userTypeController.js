const UserType = require("../../model/user-types/userTypeModel");

exports.addUserType = async (req, res) => {
  try {
    const { name } = req.body;

    const istypeExist = await UserType.findOne({ name });
    if (istypeExist) {
      return res.status(400).json({
        message: "Type is already exists",
        status: 400,
        success: false,
      });
    }

    const newData = await new UserType({
      name: name,
    });

    const result = await newData.save();

    if (result) {
      return res.status(200).json({
        message: "Type added successfully",
        data: result,
        success: true,
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Failed to create type",
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

exports.getAllUserType = async (req, res) => {
  try {
    const result = await UserType.find();
    if (result) {
      return res.status(200).json({
        message: "User type fetched",
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

exports.updateUserType = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const existingType = await UserType.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingType && existingType._id.toString() !== id) {
      return res.status(400).json({
        message: "User Type with this name already exists",
        status: 400,
        success: false,
      });
    }

    let istypeExist = await UserType.findById(id);
    if (!istypeExist) {
      return res.status(400).json({
        message: "User Type is not exists",
        status: 400,
        success: false,
      });
    }

    istypeExist.name = name;

    const result = await istypeExist.save();

    if (result) {
      return res.status(200).json({
        message: "Type updated successfully",
        data: result,
        success: true,
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Failed to update type",
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

exports.deleteUserType = async (req, res) => {
  try {
    const { id } = req.params;

    let istypeExist = await UserType.findById(id);
    if (!istypeExist) {
      return res.status(400).json({
        message: "User Type is not exists",
        status: 400,
        success: false,
      });
    }

    const result = await UserType.findByIdAndDelete(id);
    if (result) {
      return res.status(200).json({
        message: "User type deleted successfully!",
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

exports.updateUserTypeStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const istypeExist = await UserType.findById(id);
    if (!istypeExist) {
      return res.status(400).json({
        message: "User Type does not exist",
        status: 400,
        success: false,
      });
    }

    const updatedStatus = !istypeExist.status;
    
    const result = await UserType.findByIdAndUpdate(
      id,
      { status: updatedStatus },
      { new: true }
    );
    if (result) {
      return res.status(200).json({
        message: "User type status updated successfully!",
        id,
        data: result,
        status: 200,
        success: true,
      });
    } else {
      return res.status(500).json({
        message: "Error updating user type",
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
