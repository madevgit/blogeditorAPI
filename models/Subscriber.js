const mongoose = require("mongoose");
const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
  type: { type: String, required: true, enum: ["both", "newsletter", "blog"] },
});
module.exports = mongoose.model("Subscriber", SubscriberSchema);
