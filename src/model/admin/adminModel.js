const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"], 
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  tokenVersion:{
    type:Number,
    default:0
  }
});

const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;
