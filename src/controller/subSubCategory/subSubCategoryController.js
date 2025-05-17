const SubSubCategory = require("../../model/SubSubCategory/SubSubCategory");
const SubCategory = require("../../model/sub-category/subCategoryModel");

exports.addSubSubCategory = async (req, res) => {
  try {
    const { name, subCategoryId } = req.body;

    const isSubCategoryExist = await SubSubCategory.findOne({ name });
    if (isSubCategoryExist) {
      return res.status(400).json({
        message: "Sub-SubCategory already exists",
        status: 400,
        success: false,
      });
    }

    const isCategoryExist = await SubCategory.findById(subCategoryId);
    if (!isCategoryExist) {
      return res.status(400).json({
        message: "Sub-Category does not exist",
        status: 400,
        success: false,
      });
    }

    const newSubSubCategory = new SubSubCategory({
      name,
      subCategoryId,
    });

    const result = await newSubSubCategory.save();

    if (result) {
      return res.status(200).json({
        message: "Sub-SubCategory added successfully",
        data: result,
        success: true,
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Failed to create Sub-SubCategory",
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

exports.getAllSubSubCategory = async (req, res) => {
  try {
    let { page = 1, limit = 10, subCategoryId } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const filter = {};
    if (subCategoryId) {
      filter.subCategoryId = subCategoryId;
    }

    const result = await SubSubCategory.find(filter)
      .populate("subCategoryId", "name status")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await SubSubCategory.countDocuments(filter);

    const modifiedResult = result.map((subSubCat) => {
      const subSubCatObj = subSubCat.toObject();

      subSubCatObj.subCategoryData = subSubCatObj.subCategoryId || null;

      delete subSubCatObj.subCategoryId;

      if (
        subSubCatObj.subCategoryData &&
        subSubCatObj.subCategoryData.status === false
      ) {
        subSubCatObj.status = false;
      }

      return subSubCatObj;
    });

    if (modifiedResult) {
      return res.status(200).json({
        message: "Sub-SubCategories fetched successfully",
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

exports.updateSubSubCategory = async (req, res) => {
  try {
    const { name, subCategoryId } = req.body;
    const { id } = req.params;

    const existingSubSubCategory = await SubSubCategory.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (
      existingSubSubCategory &&
      existingSubSubCategory._id.toString() !== id
    ) {
      return res.status(400).json({
        message: "Sub-SubCategory with this name already exists",
        status: 400,
        success: false,
      });
    }

    const isSubSubCategoryExist = await SubSubCategory.findById(id);
    if (!isSubSubCategoryExist) {
      return res.status(400).json({
        message: "SubCategory does not exist",
        status: 400,
        success: false,
      });
    }

    if (subCategoryId) {
      const isSubCategoryExist = await SubCategory.findById(subCategoryId);
      if (!isSubCategoryExist) {
        return res.status(400).json({
          message: "Provided SubCategory does not exist",
          status: 400,
          success: false,
        });
      }
      isSubSubCategoryExist.subCategoryId = subCategoryId;
    }

    if (name) {
      isSubSubCategoryExist.name = name;
    }

    const result = await isSubSubCategoryExist.save();

    const populatedSubSubCategory = await SubSubCategory.findById(
      result?._id
    ).populate("subCategoryId", "name status");

    const subSubCatObj = populatedSubSubCategory.toObject();

    subSubCatObj.subCategoryData = subSubCatObj.subCategoryId || null;

    delete subSubCatObj.subCategoryId;

    if (
      subSubCatObj.subCategoryData &&
      subSubCatObj.subCategoryData.status === false
    ) {
      subSubCatObj.status = false;
    }

    if (subSubCatObj) {
      return res.status(200).json({
        message: "Sub-SubCategory updated successfully",
        data: subSubCatObj,
        success: true,
        status: 200,
      });
    } else {
      return res.status(400).json({
        message: "Failed to update Sub-SubCategory",
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

exports.deleteSubSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const isSubSubCategoryExist = await SubSubCategory.findById(id);
    if (!isSubSubCategoryExist) {
      return res.status(400).json({
        message: "Sub-SubCategory does not exist",
        status: 400,
        success: false,
      });
    }

    const result = await SubSubCategory.findByIdAndDelete(id);
    if (result) {
      return res.status(200).json({
        message: "Sub-SubCategory deleted successfully!",
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

exports.updateSubSubCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const isSubSubCategoryExist = await SubSubCategory.findById(id);
    if (!isSubSubCategoryExist) {
      return res.status(400).json({
        message: "Sub-SubCategory does not exist",
        status: 400,
        success: false,
      });
    }

    const updatedStatus = !isSubSubCategoryExist.status;

    const result = await SubSubCategory.findByIdAndUpdate(
      id,
      { status: updatedStatus },
      { new: true }
    );

    if (result) {
      return res.status(200).json({
        message: "Sub-SubCategory status updated successfully!",
        id,
        data: result,
        status: 200,
        success: true,
      });
    } else {
      return res.status(500).json({
        message: "Error updating Sub-SubCategory",
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

//For User
exports.getAllActiveSubSubCategory = async (req, res) => {
  try {
    let { page = 1, limit = 1000, subCategoryId } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const filter = {
      status: true,
    };
    if (subCategoryId) {
      filter.subCategoryId = subCategoryId;
    }

    const result = await SubSubCategory.find(filter)
      .populate("subCategoryId", "name status")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await SubSubCategory.countDocuments(filter);

    const modifiedResult = result.map((subSubCat) => {
      const subSubCatObj = subSubCat.toObject();

      subSubCatObj.subCategoryData = subSubCatObj.subCategoryId || null;

      delete subSubCatObj.subCategoryId;

      if (
        subSubCatObj.subCategoryData &&
        subSubCatObj.subCategoryData.status === false
      ) {
        subSubCatObj.status = false;
      }

      return subSubCatObj;
    });

    if (modifiedResult) {
      return res.status(200).json({
        message: "Sub-SubCategories fetched successfully",
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
