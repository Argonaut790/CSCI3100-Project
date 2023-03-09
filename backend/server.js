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

const accountRoute = require("./accountRoute");
app.use("/account", accountRoute);

//test data passing to database
require("./model/test")

const testModel = mongoose.model("UserInfo");
console.log(testModel);

app.post("/test", async(req,res)=> {
    const {username, email, password} = req.body;
    const data = {username, email, password};
    console.log(`data = ${username}`);
    try {
        //create Object in db
        await testModel.insertMany([data]);
        res.send({status: "Object created successfully"});
        console.log("Data inserted successfully");
    }catch (error) {
        res.send({status: "Test failed successfully"});
        console.log(error)
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});