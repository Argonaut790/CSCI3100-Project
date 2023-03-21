require("dotenv").config();
const express = require("express");
const Account = require("../model/account");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getConfirmationCode = require("../confimationCode");
const sendConfirmationEmail = require("../emailVerify");

// Login
router.post("/login", async (req, res) => {
  const account = new Account({
    password: req.body.password,
    email: req.body.email,
  });

  const user = await Account.find({ email: req.body.email });
  const count = await Account.find({
    email: req.body.email,
  }).count({ sent_at: null });

  if (count != 1) {
    res.status(400).send("Wrong email / password");
  } else {
    user.forEach(async (e) => {
      if (
        (await bcrypt.compare(req.body.password, e.password)) &&
        e.isActivated === true
      ) {
        if (e.isConfirmed === false) {
          res
            .status(401)
            .send(
              "Your account is not verified, Please check your email / spambox."
            );
        } else {
          const accessToken = generateAccessToken(e.email);
          const refreshToken = jwt.sign(e.email, process.env.REFRESH_TOEKN);
          refreshTokens.push(refreshToken);
          res.status(200).json({
            username: e.username,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        }
      } else if (e.isActivated === false) {
        res
          .status(401)
          .send(
            "Your account is deactivated. Please contact the site administrator in admin@rettiwt.com"
          );
      } else {
        res.status(404).send();
      }
    });
  }
});

// Sign up
router.post("/", async (req, res) => {
  //TODO: server-side validation
  if (req.body.isGoogleSign === true) {
    const account = new Account({
      username: req.body.username,
      email: req.body.email,
      isGoogleSign: req.body.isGoogleSign,
    });
    try {
      const saveduser = await account.save();
      res.status(200).json(saveduser);
    } catch (err) {
      res.json({ message: err });
    }
  } else {
    const user = await Account.find({ email: req.body.email }).count({
      sent_at: null,
    });
    if (user) {
      return res.status(400).json("email exists");
    }

    // Server-side validation
    const emailRegEx =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const passwordRegEx = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
    );
    if (!req.body.email.match(emailRegEx)) {
      console.log(1);
      return res.status(401).json("Invalid email");
    }
    if (!req.body.password.match(passwordRegEx)) {
      console.log(2);
      return res.status(401).json("Invalid password");
    }

    // Encrypt user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Generate confirmation code
    const token = getConfirmationCode();

    const account = new Account({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      isGoogleSign: req.body.isGoogleSign,
      confirmationCode: token,
    });

    try {
      const saveduser = await account.save();
      sendConfirmationEmail(req.body.username, req.body.email, token);
      res.status(200).json(saveduser);
    } catch (err) {
      res.json({ message: err });
    }
  }
});

// Confirm account
router.patch("/auth/:confirmationCode", async (req, res) => {
  const user = await Account.find({
    confirmationCode: req.params.confirmationCode,
  });
  console.log(req.params.confirmationCode);
  if (!user) {
    return res.status(404).send("not existed");
  }
  const updatedAccount = await Account.updateOne(
    { confirmationCode: req.params.confirmationCode },
    { $set: { isConfirmed: true } }
  );
  res.status(200).json(updatedAccount);
});

// Update password of a user
router.patch("/:email", async (req, res) => {
  try {
    const user = await Account.find({
      username: req.body.username,
      email: req.params.email,
    }).count({ sent_at: null });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    if (user > 0) {
      const updatedAccount = await Account.updateMany(
        { email: req.params.email },
        { $set: { password: hashedPassword } }
      );

      res.status(200).json(updatedAccount);
    } else {
      res.status(404).send("not existed");
    }
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Get all the users
router.get("/", async (req, res) => {
  try {
    const list = await Account.find();
    res.json(list);
  } catch (err) {
    res.json({ message: err });
  }
});

// Get a user profile
router.get("/:email", async (req, res) => {
  try {
    const user = await Account.find({
      email: req.params.email,
    });
    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

let refreshTokens = [];

router.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOEKN, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ username: user });
    res.json({ accessToken: accessToken });
  });
});

router.delete("/login", async (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

// Generate JWT
function generateAccessToken(email) {
  return jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1 day",
  });
}

module.exports = router;
