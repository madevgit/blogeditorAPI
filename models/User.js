const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const UserSchema = new Schema({
  email: { type: String, required: true, index: { unique: true } },
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  profil: { type: String, required: true },
  poste: { type: String, trim: true },
});
module.exports = mongoose.model("User", UserSchema);
