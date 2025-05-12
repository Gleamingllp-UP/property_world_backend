const mongoose = require("mongoose");

const ContactUsSchema = new mongoose.Schema(
  {
    tele_phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    whatsapp_number: {
      type: Number,
      required: true,
    },
    coverImg: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ContactUs = mongoose.model("ContactUs", ContactUsSchema);
module.exports = ContactUs;
