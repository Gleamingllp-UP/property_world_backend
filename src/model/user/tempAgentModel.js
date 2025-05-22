const mongoose = require("mongoose");
const TempUser = require("./tempUserModel");

const tempAgentSchema = new mongoose.Schema({
  trade_license: { type: String, required: true },
  company_name: { type: String, required: true },
  office_address: { type: String, required: true },
  broker_license_number: { type: String, required: true },
  office_registration_number: { type: String, required: true },
  agency_logo: { type: String },
  agent_photo: { type: String },
});

const TempAgentUser = TempUser.discriminator("TempAgent", tempAgentSchema);
module.exports = TempAgentUser;
