const express = require("express");
const Account = require("./model/account");

const app = express();
app.use(express.json()); // middleware for parsing JSON payloads

// POST route for creating a new account
app.post("/accounts", async (req, res) => {
  const { username, password, email } = req.body; // extract the fields from the request body

  // Create a new account object with the extracted fields
  const newAccount = new Account({ username, password, email });

  try {
    // Save the new account to the database
    await newAccount.save();
    res.status(201).send("Account created successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
