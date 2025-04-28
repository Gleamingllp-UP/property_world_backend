const Category = require("../../model/category/categoryModel");

exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const isCategoryExist = await Category.findOne({ name });
    if (isCategoryExist) {
      return res.status(400).json({
        message: "Category is already exists",
        status: 400,
        success: false,
      });
    }

    const newData = await new Category({
      name: name,
    });

    const result = await newData.save();

    if (result) {
      return res.status(200).json({
        message: "Category added successfully",
        data: result,
        success: true,
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Failed to create Category",
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

exports.getAllCategory = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;
    const result = await Category.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Category.countDocuments();

    if (result) {
      return res.status(200).json({
        message: "Category fetched successfully",
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
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

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const existingCategory = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingCategory && existingCategory._id.toString() !== id) {
      return res.status(400).json({
        message: "Category with this name already exists",
        status: 400,
        success: false,
      });
    }

    let isCategoryExist = await Category.findById(id);
    if (!isCategoryExist) {
      return res.status(400).json({
        message: "Category is not exists",
        status: 400,
        success: false,
      });
    }

    isCategoryExist.name = name;

    const result = await isCategoryExist.save();

    if (result) {
      return res.status(200).json({
        message: "Category updated successfully",
        data: result,
        success: true,
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Failed to update category",
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

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    let isCategoryExist = await Category.findById(id);
    if (!isCategoryExist) {
      return res.status(400).json({
        message: "Category is not exists",
        status: 400,
        success: false,
      });
    }

    const result = await Category.findByIdAndDelete(id);
    if (result) {
      return res.status(200).json({
        message: "Category deleted successfully!",
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

exports.updateCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const isCategoryExist = await Category.findById(id);
    if (!isCategoryExist) {
      return res.status(400).json({
        message: "Category does not exist",
        status: 400,
        success: false,
      });
    }

    const updatedStatus = !isCategoryExist.status;

    const result = await Category.findByIdAndUpdate(
      id,
      { status: updatedStatus },
      { new: true }
    );
    if (result) {
      return res.status(200).json({
        message: "Category status updated successfully!",
        id,
        data: result,
        status: 200,
        success: true,
      });
    } else {
      return res.status(500).json({
        message: "Error updating Category s",
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
