const mongoose = require("mongoose");
const SubCategory = require("../sub-category/subCategoryModel");
const subSubCategorySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

subSubCategorySchema.pre("save", async function (next) {
  try {
    const subCategoryExists = await SubCategory.findById(this.subCategoryId);
    if (!subCategoryExists) {
      const err = new Error("Sub-Category not found for given subCategoryId");
      err.statusCode = 400;
      return next(err);
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("SubSubCategory", subSubCategorySchema);
