const nodemailer = require("nodemailer");
require("dotenv").config();

const username = process.env.USERNAME;
const pasword = process.env.PASSWORD;
const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: username,
    pass: pasword,
  },
});

// TODO: Replace the localhost URL to production URL
const sendConfirmationEmail = (name, email, confirmationCode) => {
  console.log("Check");
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Rettiwt Signup Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for registering Rettiwt. Please confirm your email by clicking on the following link</p>
          <a href=http://localhost:3000/confirm/${confirmationCode}> Click here</a>
          </div>`,
    })
    .catch((err) => console.log(err));
};

module.exports = sendConfirmationEmail;
