const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  // userEmail: {
  //   type: String,
  //   required: true,
  // },
  image: {
    data: String,
  },
  desc: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  // comment: {
  //   type: Array,
  // },
  timestamp: {
    type: String,
    default: Date.now(),
  },
  // public: {
  //   type: Boolean,
  //   required: true,
  // },
});

module.exports = mongoose.model("posts", postSchema);
