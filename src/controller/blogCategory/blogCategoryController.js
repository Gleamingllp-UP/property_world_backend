const BlogCategory = require("../../model/blogCategory/blogCategoryModel");

exports.addBlogCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const isBlogCategoryExist = await BlogCategory.findOne({ name });
    if (isBlogCategoryExist) {
      return res.status(400).json({
        message: "Blog Category is already exists",
        status: 400,
        success: false,
      });
    }

    const newData = await new BlogCategory({
      name: name,
    });

    const result = await newData.save();

    if (result) {
      return res.status(200).json({
        message: "Blog Category added successfully",
        data: result,
        success: true,
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Failed to create BlogCategory",
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

exports.getAllDefaulteBlogCategory = async (req, res) => {
  try {
    const result = await BlogCategory.find().sort({ name: 1 });

    if (result) {
      return res.status(200).json({
        message: "Blog Category fetched successfully",
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

exports.getAllBlogCategory = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const result = await BlogCategory.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1, name: 1 });

    const total = await BlogCategory.countDocuments();

    if (result) {
      return res.status(200).json({
        message: "Blog Category fetched successfully",
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

exports.updateBlogCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const existingBlogCategory = await BlogCategory.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingBlogCategory && existingBlogCategory._id.toString() !== id) {
      return res.status(400).json({
        message: "Blog Category with this name already exists",
        status: 400,
        success: false,
      });
    }

    let isBlogCategoryExist = await BlogCategory.findById(id);
    if (!isBlogCategoryExist) {
      return res.status(400).json({
        message: "Blog Category is not exists",
        status: 400,
        success: false,
      });
    }

    isBlogCategoryExist.name = name;

    const result = await isBlogCategoryExist.save();

    if (result) {
      return res.status(200).json({
        message: "Blog Category updated successfully",
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

exports.deleteBlogCategory = async (req, res) => {
  try {
    const { id } = req.params;

    let isBlogCategoryExist = await BlogCategory.findById(id);
    if (!isBlogCategoryExist) {
      return res.status(400).json({
        message: "Blog Category is not exists",
        status: 400,
        success: false,
      });
    }

    const result = await BlogCategory.findByIdAndDelete(id);
    if (result) {
      return res.status(200).json({
        message: "Blog Category deleted successfully!",
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

exports.updateBlogCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const isBlogCategoryExist = await BlogCategory.findById(id);
    if (!isBlogCategoryExist) {
      return res.status(400).json({
        message: "Blog Category does not exist",
        status: 400,
        success: false,
      });
    }

    const updatedStatus = !isBlogCategoryExist.status;

    const result = await BlogCategory.findByIdAndUpdate(
      id,
      { status: updatedStatus },
      { new: true }
    );
    if (result) {
      return res.status(200).json({
        message: "Blog Category status updated successfully!",
        id,
        data: result,
        status: 200,
        success: true,
      });
    } else {
      return res.status(500).json({
        message: "Error updating BlogCategory s",
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
