const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// POST: /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // 2. Validate Password (Compare plain text to Hash)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 3. Login Success - Send back user info
        // (In a real app, you would sign a JWT token here)
        res.json({
            message: "Login Successful",
            token: "fake-jwt-token-123", // Mock token for now
            role: user.role,
            branch: user.branch
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Fetch all users (Staff List) - Excludes passwords
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // '-password' hides the hash
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;