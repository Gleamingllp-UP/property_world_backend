const SubCategory = require("../../model/sub-category/subCategoryModel");
const Category = require("../../model/category/categoryModel");

exports.addSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    const isSubCategoryExist = await SubCategory.findOne({ name });
    if (isSubCategoryExist) {
      return res.status(400).json({
        message: "SubCategory already exists",
        status: 400,
        success: false,
      });
    }

    const isCategoryExist = await Category.findById(categoryId);
    if (!isCategoryExist) {
      return res.status(400).json({
        message: "Category does not exist",
        status: 400,
        success: false,
      });
    }

    const newSubCategory = new SubCategory({
      name,
      categoryId,
    });

    const result = await newSubCategory.save();

    const populatedSubCategory = await SubCategory.findById(
      result?._id
    ).populate("categoryId", "name status");

    const subCatObj = populatedSubCategory.toObject();

    subCatObj.categoryData = subCatObj.categoryId || null;

    delete subCatObj.categoryId;

    if (subCatObj.categoryData && subCatObj.categoryData.status === false) {
      subCatObj.status = false;
    }

    if (subCatObj) {
      return res.status(200).json({
        message: "SubCategory added successfully",
        data: subCatObj,
        success: true,
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Failed to create SubCategory",
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

exports.getAllSubCategory = async (req, res) => {
  try {
    let { page = 1, limit = 10,categoryId } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const filter = {};
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    const result = await SubCategory.find(filter)
      .populate("categoryId", "name status")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await SubCategory.countDocuments(filter);

    const modifiedResult = result.map((subCat) => {
      const subCatObj = subCat.toObject();

      subCatObj.categoryData = subCatObj.categoryId || null;

      delete subCatObj.categoryId;

      if (subCatObj.categoryData && subCatObj.categoryData.status === false) {
        subCatObj.status = false;
      }

      return subCatObj;
    });

    if (modifiedResult) {
      return res.status(200).json({
        message: "SubCategories fetched successfully",
        data: modifiedResult,
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

exports.updateSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const { id } = req.params;

    const existingSubCategory = await SubCategory.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingSubCategory && existingSubCategory._id.toString() !== id) {
      return res.status(400).json({
        message: "SubCategory with this name already exists",
        status: 400,
        success: false,
      });
    }

    const isSubCategoryExist = await SubCategory.findById(id);
    if (!isSubCategoryExist) {
      return res.status(400).json({
        message: "SubCategory does not exist",
        status: 400,
        success: false,
      });
    }

    if (categoryId) {
      const isCategoryExist = await Category.findById(categoryId);
      if (!isCategoryExist) {
        return res.status(400).json({
          message: "Provided Category does not exist",
          status: 400,
          success: false,
        });
      }
      isSubCategoryExist.categoryId = categoryId;
    }

    if (name) {
      isSubCategoryExist.name = name;
    }

    const result = await isSubCategoryExist.save();

    const populatedSubCategory = await SubCategory.findById(
        result?._id
      ).populate("categoryId", "name status");
  
      const subCatObj = populatedSubCategory.toObject();
  
      subCatObj.categoryData = subCatObj.categoryId || null;
  
      delete subCatObj.categoryId;
  
      if (subCatObj.categoryData && subCatObj.categoryData.status === false) {
        subCatObj.status = false;
      }

    if (subCatObj) {
      return res.status(200).json({
        message: "SubCategory updated successfully",
        data: subCatObj,
        success: true,
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Failed to update SubCategory",
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

exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const isSubCategoryExist = await SubCategory.findById(id);
    if (!isSubCategoryExist) {
      return res.status(400).json({
        message: "SubCategory does not exist",
        status: 400,
        success: false,
      });
    }

    const result = await SubCategory.findByIdAndDelete(id);
    if (result) {
      return res.status(200).json({
        message: "SubCategory deleted successfully!",
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

exports.updateSubCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const isSubCategoryExist = await SubCategory.findById(id);
    if (!isSubCategoryExist) {
      return res.status(400).json({
        message: "SubCategory does not exist",
        status: 400,
        success: false,
      });
    }

    const updatedStatus = !isSubCategoryExist.status;

    const result = await SubCategory.findByIdAndUpdate(
      id,
      { status: updatedStatus },
      { new: true }
    );

    if (result) {
      return res.status(200).json({
        message: "SubCategory status updated successfully!",
        id,
        data: result,
        status: 200,
        success: true,
      });
    } else {
      return res.status(500).json({
        message: "Error updating SubCategory",
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
