const express = require("express");
const router = express.Router();
const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../utils");

// register new user
router.post("/register", async (req, res) => {
  try {
    if (!req.body.username || !req.body.password)
      return res.status(400).send({ msg: "Username and password are required" });

    const username = req.body.username;
    if (await Users.findOne({ username: username }))
      return res.status(400).send({ msg: "Username already exists" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new Users({ username: username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ msg: "User created" });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).send({ msg: "Username and password are required" });

    const user = await Users.findOne({ username: username });
    if (!user) return res.status(400).send({ msg: "Username does not exist" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send({ msg: "Incorrect password" });

    const accessToken = generateAccessToken({ username: user.username, userId: user._id });
    res.json({ accessToken: accessToken });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
