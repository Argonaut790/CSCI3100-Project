const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followerSchema = new Schema({
  followedUserId: {
    type: String,
    required: true,
  },
  followerUserId: {
    type: String,
    required: true,
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model("followers", followerSchema);
