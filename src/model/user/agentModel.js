const mongoose = require("mongoose");
const User = require("./userModel");

const agentUserSchema = new mongoose.Schema({
  trade_license: { type: String, required: true },
  company_name: { type: String, required: true },
  contact_name: { type: String, required: true },
  contact_number: { type: Number, required: true },
  office_address: { type: String, required: true },
  broker_license_number: { type: Number, required: true },
  office_registration_number: { type: String, required: true },
  agency_logo: { type: String },
  agent_photo: { type: String },
});

const AgentUser = User.discriminator("Agent", agentUserSchema);
module.exports = AgentUser;
