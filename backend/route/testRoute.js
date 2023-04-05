const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("../model/test");

const TestModel = mongoose.model("testinfos");

router.post("/", async (req, res) => {
  const { username, email, password } = req.body;
  const data = { username, email, password };
  console.log(`data = ${username}`);

  try {
    //create Object in db
    await TestModel.insertMany([data]);
    res.send({ status: "Object created successfully" });
    console.log("Data inserted successfully");
  } catch (error) {
    res.send({ status: "Test failed" });
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await TestModel.find({});
    res.send(data);
    console.log("Data retrieved successfully");
  } catch (error) {
    res.send({ status: "Test failed" });
    console.log(error);
  }
});

module.exports = router;
