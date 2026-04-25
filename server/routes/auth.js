const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, password: hashedPassword, email });
    const user = await newUser.save();
    res.status(200).json({ _id: user._id, username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).json({ error: 'Wrong credentials!' });

    const validated = await bcrypt.compare(req.body.password, user.password);
    if (!validated) return res.status(400).json({ error: 'Wrong credentials!' });

    const token = jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '3d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' }).status(200).json({ _id: user._id, username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token', { sameSite: 'strict' }).status(200).json('Logged out successfully!');
});

// Refetch User
router.get('/refetch', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated!' });
  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) return res.status(403).json({ error: 'Token is not valid!' });
    res.status(200).json(data);
  });
});

module.exports = router;
