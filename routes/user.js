const express = require("express");
const User = require("../models/userModel");
const router = express.Router();
const jsonwebtoken = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/get-userinfo-by-id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
