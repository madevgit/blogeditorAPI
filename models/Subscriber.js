const mongoose = require("mongoose");
const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
  canal: {
    type: String,
    required: true,
    enum: ["sendime", "qoswebsite"],
  },
  agreeNews: {
    type: Boolean,
    default: false,
  },
  agreeBlog: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("Subscriber", SubscriberSchema);
