const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  userId: {
    type: String,
    default: () => uuidv4().substr(0, 6),
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  confirmationCode: {
    type: String,
    required: false,
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
  isPrivate: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model("accounts", AccountSchema);
