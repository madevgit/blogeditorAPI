const mongoose = require("mongoose");
const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
});
module.exports = mongoose.model("Subscriber", SubscriberSchema);
