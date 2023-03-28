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
  const user = await Account.findOne({ email: req.body.email });

  if (!user) {
    res.status(400).send("Wrong email / password");
  } else {
    // Check if password correct
    if (await bcrypt.compare(req.body.password, user.password)) {
      // Check if account confirmed
      if (user.isConfirmed === false) {
        res
          .status(401)
          .send(
            "Your account is not verified, Please check your email / spambox."
          );
        // Check if account activated
      } else if (user.isActivated === false) {
        res
          .status(401)
          .send(
            "Your account is deactivated. Please contact the site administrator in admin@rettiwt.com"
          );
        // Login successfully
      } else {
        const accessToken = generateAccessToken(user.email);
        const refreshToken = jwt.sign(user.email, process.env.REFRESH_TOEKN);
        refreshTokens.push(refreshToken);
        res.status(200).json({
          userId: user.userId,
          username: user.username,
          isAdmin: user.isAdmin,
          isPrivate: user.isPrivate,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      }
    } else {
      res.status(404).send();
    }
  }
});

// Sign up
router.post("/", async (req, res) => {
  const registeredEmailUser = await Account.find({
    email: req.body.email,
    isGoogleSign: false,
  });
  const registeredGoogleUser = await Account.find({
    email: req.body.email,
    isGoogleSign: true,
  });
  if (req.body.isGoogleSign == true) {
    if (registeredEmailUser.length) {
      // Already registered in email signup
      return res.status(400).json("Email registered in our system");
    } else if (registeredGoogleUser.length) {
      return res.status(200).json(registeredGoogleUser[0]);
    }
    const account = new Account({
      username: req.body.username,
      email: req.body.email,
      isGoogleSign: req.body.isGoogleSign,
      isConfirmed: true,
    });
    try {
      const saveduser = await account.save();
      res.status(200).json(saveduser);
    } catch (err) {
      res.json({ message: err });
    }
  } else {
    if (registeredGoogleUser.length) {
      // Already registered in Google signup
      return res.status(400).json("Email registered using google signin");
    } else if (registeredEmailUser.length) {
      // Already registered in email signup
      return res.status(400).json("Email registered in our system");
    }

    // Server-side validation
    const emailRegEx =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const passwordRegEx = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
    );
    if (!req.body.email.match(emailRegEx)) {
      return res.status(401).json("Invalid email");
    }
    if (!req.body.password.match(passwordRegEx)) {
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
      res
        .status(401)
        .json("Unkown error, please try again or sign up with another method.");
    }
  }
});

// Confirm account
router.patch("/auth/:confirmationCode", async (req, res) => {
  const user = await Account.find({
    confirmationCode: req.params.confirmationCode,
  });
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

// Get all the users info
router.get("/", async (req, res) => {
  try {
    const list = await Account.find();
    res.json(list);
  } catch (err) {
    res.json({ message: err });
  }
});

// Update user isActivated status by Id
router.patch("/status/:userId", async (req, res) => {
  try {
    const updatedAccount = await Account.updateOne(
      { userId: req.params.userId },
      { $set: { isActivated: req.body.isActivated } }
    );
    res.status(200).json({ updatedAccount });
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Update isPrivate status by Id
router.patch("/private/:userId", async (req, res) => {
  try {
    const updatedAccount = await Account.updateOne(
      { userId: req.params.userId },
      { $set: { isPrivate: req.body.isPrivate } }
    );
    res.status(200).json(updatedAccount);
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Change user admin status by Id
router.patch("/admin/:userId", async (req, res) => {
  try {
    const updatedAccount = await Account.updateOne(
      { userId: req.params.userId },
      { $set: { isAdmin: true } }
    );
    res.status(200).json({ updatedAccount });
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Get user bio by Id
router.get("/bio/:userId", async (req, res) => {
  try {
    const user = await Account.findOne({
      userId: req.params.userId,
    });
    res.status(200).json({ bio: user.bio });
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Edit bio by Id
router.patch("/bio/:userId", async (req, res) => {
  try {
    const updatedAccount = await Account.updateOne(
      { userId: req.params.userId },
      { $set: { bio: req.body.bio } }
    );
    res.status(200).json(updatedAccount);
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Get user by Id
router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await Account.findOne({
      userId: req.params.userId,
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Fuzzy Search username & userId
router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await Account.fuzzySearch(req.body.searchString);
    res.status(200).json(user);
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
