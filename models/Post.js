const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["company", "engineering", "marketing"],
    },
    resume: { type: String, required: true, trim: true, min: 144, max: 200 },
    poster: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    published: { type: Boolean, required: true },
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);
mongoose.set("useFindAndModify", false);
module.exports = mongoose.model("Post", PostSchema);
