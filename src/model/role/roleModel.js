const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
  role_name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Role = mongoose.model("Role", roleSchema); 
module.exports = Role;
