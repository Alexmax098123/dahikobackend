const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

// Signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log("Entered Email:", email);
    console.log("Entered Password:", password);

    if (!email || !password) 
        return res.status(400).json({ message: "All fields are required" });

    try {
        const user = await User.findOne({ email });

        console.log("User found:", user);

        if (!user) 
            return res.status(400).json({ message: "Invalid credentials" });

        console.log("Stored Password:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);

        console.log("Password Match:", isMatch);

        if (!isMatch) 
            return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ 
            message: "Login successful", 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email,
                phone: user.phone,
                city: user.city,
                address: user.address
            } 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get Profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Update Profile
router.post('/profile', authMiddleware, async (req, res) => {
    const { name, phone, city, address } = req.body;
    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (city) user.city = city;
        if (address) user.address = address;

        await user.save();
        res.json({ 
            message: "Profile updated successfully", 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                phone: user.phone, 
                city: user.city, 
                address: user.address 
            } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;