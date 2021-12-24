const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

var Contact = mongoose.model("contact", contactSchema);
module.exports = Contact;
