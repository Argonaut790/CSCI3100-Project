require("dotenv").config();
const express = require("express");
const Account = require("../model/account");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getConfirmationCode = require("../confimationCode");
const sendPasswordResetEmail = require("../emailVerify");

// Forgot Password
router.post("/account/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Account.findOne({ email });

        if (!user) {
            return res.status(404).send("No user found with that email address.");
        }

        // Generate confirmation code
        const token = getConfirmationCode();

        user.confirmationCode = confirmationCode;
        try {
            const saveduser = await account.save();
            sendPasswordResetEmail(req.body.username, req.body.email, token);
            res.status(200).json(saveduser);
        } catch (err) {
            res
                .status(401)
                .json("Unknown error, please try again or sign up with another method.");
        }

        res.status(200).send("A password reset email has been sent to your email address.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
})


// Reset Password
router.post("/account/reset-password", async (req, res) => {
    const { confirmationCode, newPassword } = req.body;

    try {
        const user = await Account.findOne({ confirmationCode });

        if (!user) {
            return res.status(404).send("Invalid confirmation code.");
        }

        const salt = await bcrypt.genSalt(10);
        // using the basic version of password for testing first
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        user.confirmationCode = undefined;
        await user.save();

        res.status(200).send("Password has been successfully reset.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;