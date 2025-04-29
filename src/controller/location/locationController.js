const Location = require("../../model/location/locationModal");

exports.addLocation = async (req, res) => {
  try {
    const { name, pincode, longitude, latitude } = req.body;

    const isLocationExist = await Location.findOne({ name });
    if (isLocationExist) {
      return res.status(400).json({
        message: "Location already exists",
        status: 400,
        success: false,
      });
    }

    const newLocation = new Location({
      name,
      pincode,
      longitude,
      latitude,
    });

    const result = await newLocation.save();

    if (result) {
      return res.status(200).json({
        message: "Location added successfully",
        data: result,
        success: true,
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Failed to create Location",
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

exports.getAllLocation = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const result = await Location.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Location.countDocuments();

    if (result) {
      return res.status(200).json({
        message: "Locations fetched successfully",
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

exports.updateLocation = async (req, res) => {
  try {
    const { name, pincode, longitude, latitude } = req.body;

    const { id } = req.params;

    const existingLocation = await Location.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingLocation && existingLocation._id.toString() !== id) {
      return res.status(400).json({
        message: "Location with this name already exists",
        status: 400,
        success: false,
      });
    }

    const isLocationExist = await Location.findById(id);
    if (!isLocationExist) {
      return res.status(400).json({
        message: "Location does not exist",
        status: 400,
        success: false,
      });
    }

    if (name) {
      isLocationExist.name = name;
    }
    if (pincode) {
      isLocationExist.pincode = pincode;
    }
    if (longitude) {
      isLocationExist.longitude = longitude;
    }
    if (latitude) {
      isLocationExist.latitude = latitude;
    }

    const result = await isLocationExist.save();

    if (result) {
      return res.status(200).json({
        message: "Location updated successfully",
        data: result,
        success: true,
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Failed to update Location",
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

exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const isLocationExist = await Location.findById(id);
    if (!isLocationExist) {
      return res.status(400).json({
        message: "Location does not exist",
        status: 400,
        success: false,
      });
    }

    const result = await Location.findByIdAndDelete(id);
    if (result) {
      return res.status(200).json({
        message: "Location deleted successfully!",
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

exports.updateLocationStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const isLocationExist = await Location.findById(id);
    if (!isLocationExist) {
      return res.status(400).json({
        message: "Location does not exist",
        status: 400,
        success: false,
      });
    }

    const updatedStatus = !isLocationExist.status;

    const result = await Location.findByIdAndUpdate(
      id,
      { status: updatedStatus },
      { new: true }
    );

    if (result) {
      return res.status(200).json({
        message: "Location status updated successfully!",
        id,
        data: result,
        status: 200,
        success: true,
      });
    } else {
      return res.status(500).json({
        message: "Error updating Location status",
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
