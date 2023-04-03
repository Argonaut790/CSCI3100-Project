const nodemailer = require("nodemailer");
require("dotenv").config();

const user = process.env.GMAIL;
const password = process.env.GMAIL_PASSWORD;
const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: user,
    pass: password,
  },
});

// TODO: Replace the localhost URL to production URL
const sendConfirmationEmail = (name, email, confirmationCode) => {
  confirmationCode = encodeURIComponent(confirmationCode);
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Rettiwt - Please confirm your account",
      html: `<h1>Rettiwt Signup Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for registering Rettiwt. Please confirm your email by clicking on the following link</p>
          <a href=http://localhost:3000/confirm?confirmationCode=${confirmationCode}> Click here</a>
          </div>`,
    })
    .catch((err) => console.log(err));
};

const sendPasswordResetEmail = (name, email, confirmationCode) => {
    confirmationCode = encodeURIComponent(confirmationCode);
    transport
        .sendMail({
            from: user,
            to: email,
            subject: "Rettiwt - Password Reset Request",
            html: `<h1>Rettiwt Password Reset Request</h1>
                <h2>Hello ${name}</h2>
                <p>You are receiving this because you (or someone else) have requested 
                the reset of the password for your account.
                \n\nPlease click on the following link, or paste this into your browser to complete 
                the process within one hour of receiving it:\n\n<\p>
                <a herf =http://localhost:3000/reset-password?confirmationCode=${confirmationCode} Click here</a>
                <p>\n\nIf you did not request this, please ignore this email and your
                 password will remain unchanged.\n</p>
                </div>`,
        })
        .catch((err) => console.log(err));
};

module.exports = {
    sendConfirmationEmail,
    sendPasswordResetEmail,
};
