const mongoose = require("mongoose");
const Category = require("../category/categoryModel"); 

const subCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

subCategorySchema.pre("save", async function (next) {
  try {
    const categoryExists = await Category.findById(this.categoryId);
    if (!categoryExists) {
      const err = new Error("Category not found for given categoryId");
      err.statusCode = 400;
      return next(err);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
