const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  // TODO: check duplicate id
  userId: {
    type: String,
    required: true,
    default: () => uuidv4().substr(0, 6),
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  confirmationCode: {
    type: String,
    unique: true,
  },
  isActivated: {
    type: Boolean,
    default: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isGoogleSign: {
    type: Boolean,
    default: false,
  },
  avatar: {
    filename: String,
    contentType: String,
  },
  timestamp: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model("accounts", AccountSchema);
