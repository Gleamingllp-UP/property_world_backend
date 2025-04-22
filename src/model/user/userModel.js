const mongoose = require("mongoose");
const Role = require("../role/roleModel");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  ],
  tokenVersion: {
    type: Number,
    default: 0,
  },
});

userSchema.pre("save", async (next) => {
  try {
    const isRoleExist = Role.exists({ _id: this.role });

    if (!isRoleExist) {
      return next(new Error("Role is not exists"));
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
