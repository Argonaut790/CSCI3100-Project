const express = require("express");
const Account = require("../model/account");
const router = express.Router();

// Sign up
router.post("/", async (req, res) => {
  const user = await Account.find({ email: req.body.email }).count({
    sent_at: null,
  });

  const account = new Account({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    confirmationCode: "",
  });

  try {
    if (user === 0) {
      const saveduser = await account.save();
      res.status(200).json(saveduser);
    } else {
      res.status(404).send("existed");
    }
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
