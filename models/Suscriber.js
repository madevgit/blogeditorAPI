const mongoose = require("mongoose");
const SuscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
});
module.exports = mongoose.model("Suscriber", SuscriberSchema);
