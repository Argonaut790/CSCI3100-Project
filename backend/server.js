require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 5500;

// cross domain
app.use(cors());
app.use(bodyParser.json());

app.use(express.json());

// connect to the database
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true });
const db = mongoose.connection;
// check if the connection to the database is seccess or not
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to database"));

const accountRoute = require("./route/accountRoute");
app.use("/account", accountRoute);

//test data passing to database
const testRoute = require("./route/testRoute");
app.use("/test", testRoute);

//upload post
const tweetRoute = require("./route/tweetRoute");
app.use("/tweet", tweetRoute);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
