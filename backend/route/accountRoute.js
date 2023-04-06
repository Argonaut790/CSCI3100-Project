require("dotenv").config();
const express = require("express");
const Account = require("../model/account");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getConfirmationCode = require("../confimationCode");
const {
  sendConfirmationEmail,
  sendPasswordResetEmail,
} = require("../emailVerify");
const validator = require("validator");

//Image handler
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const sharp = require("sharp");

//multer
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

//Setup GridFS
const conn = mongoose.connection;

// Login
router.post("/login", async (req, res) => {
  const user = await Account.findOne({ email: req.body.email });

  if (!user) {
    res.status(400).send("Wrong email / password");
  } else {
    if (bcrypt.compare(req.body.password, user.password)) {
      // Password is correct
      if (user.isConfirmed === false) {
        // account is not yet confirmed
        res
          .status(401)
          .send(
            "Your account is not verified, Please check your email / spambox."
          );
      } else if (user.isActivated === false) {
        // account deactivated
        res
          .status(401)
          .send(
            "Your account is deactivated. Please contact the site administrator in admin@rettiwt.com"
          );
      } else if (user.isGoogleSign === true) {
        // email used in google signin
        res
          .status(401)
          .send(
            "Your email is used in Google Sign in. Please continue with Google."
          );
      } else {
        // Login successfully
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
      return res
        .status(400)
        .json(
          "Email registered in our system. Please click 'Forgot Password' if you cannot login."
        );
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
      return res
        .status(400)
        .json(
          "Email registered using Google signin. Please continue with Google."
        );
    } else if (registeredEmailUser.length) {
      // Already registered in email signup
      return res
        .status(400)
        .json(
          "This email has been registered. Please click 'Forgot Password' if you cannot login."
        );
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
        .json(
          "Unknown error, please try again or sign up with another method."
        );
    }
  }
});

// Confirm account
router.patch("/auth/:confirmationCode", async (req, res) => {
  const user = await Account.findOne({
    confirmationCode: req.params.confirmationCode,
  });
  if (!user) {
    return res.status(404).send("not existed");
  }
  const updatedAccount = await Account.updateOne(
    { confirmationCode: req.params.confirmationCode },
    { $set: { isConfirmed: true } }
  );
  res.status(200).json(user.userId);
});

// Forgot Password
router.patch("/password", async (req, res) => {
  // Get user by email
  const user = await Account.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send("No user found with that email address.");
  }
  try {
    // Generate confirmation code
    const token = getConfirmationCode();
    await Account.updateOne(
      { email: req.body.email },
      { $set: { confirmationCode: token, isConfirmed: false } }
    );
    sendPasswordResetEmail(user.username, req.body.email, token);
    res
      .status(200)
      .send("A password reset email has been sent to your email address.");
  } catch (err) {
    res
      .status(500)
      .send("Internal server error. Please try again or contact admin.");
  }
});

// Update password of a user
router.patch("/password/reset", async (req, res) => {
  try {
    const user = await Account.findOne({
      userId: req.body.userId,
    });
    if (!user) {
      return res.status(404).send("User Not Found.");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    await Account.updateOne(
      {
        userId: req.body.userId,
      },
      { $set: { password: hashedPassword } }
    );
    res.status(200).send("Password has been successfully reset.");
  } catch (err) {
    res
      .status(500)
      .send("Internal server error. Please try again or contact admin.");
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

// Get user profile info by Id
router.get("/:userId", async (req, res) => {
  try {
    const user = await Account.findOne({
      userId: req.params.userId,
    });
    res.status(200).json({
      bio: user.bio,
      username: user.username,
      email: user.email,
      avatar: user.avatar.filename,
      isPrivate: user.isPrivate,
      isAdmin: user.isAdmin,
      isGoogleSign: user.isGoogleSign,
    });
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Get user profile avatar by Id
router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await Account.findOne({
      userId: req.params.userId,
    });
    const avatarFile = user.avatar.filename;
    if (avatarFile) {
      const imageUrl = `http://${req.headers.host}/account/profile/avatar/${avatarFile}`;
      return res.status(200).json(imageUrl);
    } else return null;
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

router.get("/profile/avatar/:filename", async (req, res) => {
  try {
    // connect to mongo upload collection bucket,
    // here bucket we mean we have "upload.chunks" and "uploads.files"
    // so it actually have two collection but the root is upload which is the bucket
    const bucket = new GridFSBucket(conn.db, { bucketName: "accounts" });

    //get filename from URL params
    const filename = req.params.filename;

    // config download type
    res.set("Content-Type", "image/jpeg"); // Or any other appropriate content type
    const downloadStream = bucket.openDownloadStreamByName(filename);

    downloadStream.on("error", (error) => {
      res.status(500).json({ message: error.message });
    });

    //pipe the downloaded result to res
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload profile avatar, bio
router.patch("/profile/:userId", upload.single("image"), async (req, res) => {
  try {
    const image = req.file || null;
    const username = req.body.username; //username
    const bio = req.body.bio; //bio

    const user = await Account.findOne({
      userId: req.params.userId,
    });

    if (!image) {
      // In case there is no image, update only the bio
      const updatedAccount = await Account.updateOne(
        { userId: req.params.userId },
        { $set: { bio: bio, username: username } }
      );

      // Send the response here
      res.status(200).json({
        message: "Profile updated",
        updatedAccount,
      });
    } else {
      if (user.avatar && user.avatar.filename) {
        // If the user has an old avatar, delete it
        const bucket = new GridFSBucket(conn.db, { bucketName: "accounts" });
        const oldAvatar = await bucket.find({ filename: user.avatar.filename }).toArray();
        if (oldAvatar.length > 0) {
          await bucket.delete(oldAvatar[0]._id);
        }
      }

      // Compress and resize the image using sharp
      const metadata = await sharp(image.buffer).metadata();

      const originalWidth = metadata.width;
      const originalHeight = metadata.height;
      const desiredSize = 200;

      // Calculate the central part of the image
      const cropSize = Math.min(originalWidth, originalHeight);
      const left = parseInt((originalWidth - cropSize) / 2);
      const top = parseInt((originalHeight - cropSize) / 2);

      const resizedImageBuffer = await sharp(image.buffer)
        .extract({ left: left, top: top, width: cropSize, height: cropSize }) // Set the cropping region
        .resize({
          width: desiredSize,
          height: desiredSize,
          kernel: sharp.kernel.lanczos3,
        }) // Set the desired dimensions
        .jpeg({ quality: 95 }) // Set the desired output format
        .toBuffer();

      //we use uploads collection to store those images' chunk
      const bucket = new GridFSBucket(conn.db, { bucketName: "accounts" });

      const uploadStream = bucket.openUploadStream(image.originalname, {
        contentType: image.mimetype,
      });

      uploadStream.on("error", (err) => {
        console.error(err);
        res.status(500).send(err);
      });

      uploadStream.on("finish", async (file) => {
        // Create a new post object and save it to the database
        const imageObj = {
          filename: file.filename,
          contentType: file.contentType,
        };

        // Update the user's bio and avatar in DB
        const updatedAccount = await Account.updateOne(
          { userId: req.params.userId },
          { $set: { bio: bio, avatar: imageObj, username: username } }
        );

        // Send the response here
        res.status(200).json({
          message: "File uploaded and stored in MongoDB, profile updated",
          file,
          updatedAccount,
        });

        // post.save().then(() => {
        //   console.log("Data inserted successfully");
        // });
      });

      uploadStream.write(resizedImageBuffer);
      uploadStream.end();
    }
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
router.get("/search/:searchString", async (req, res) => {
  try {
    // Validate and sanitize search string
    const sanitizedQuery = validator.escape(req.params.searchString + "");
    // Perform fuzzy search with RegExp
    const pattern = new RegExp(
      sanitizedQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
      "gi"
    );
    const users = await Account.find({
      $or: [{ username: { $regex: pattern } }, { userId: { $regex: pattern } }],
    });
    //TODO: select useful fields only
    res.status(200).json(users);
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

router.delete("/login/:token", async (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.params.token);
  res.sendStatus(204);
});

// Generate JWT
function generateAccessToken(email) {
  return jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1 day",
  });
}

module.exports = router;
