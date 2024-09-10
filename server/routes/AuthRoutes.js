const admin = require('firebase-admin');
const User = require('../models/User');
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.post('/register-google', async (req, res) => {
    const { token, username, password } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email } = decodedToken;
        let user = await User.findOne({ email });
        const uidSlice = uid.slice(0, 6);
        if (!user) {
            user = new User({
                username: username,
                email: email,
                uid: uidSlice,
                password:password,  
                balance: 0.00,
                business: 0.00,
                shares: 0.00,
                crypto: 0.00,
                inflationRate: '1.00%',
            });
            await user.save();
        }

        res.status(200).json({ message: 'User registered successfully', uid });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});


router.post('/signin-email', async (req, res) => {
    try {
        const { email, password } = req.body;

        const userRecord = await admin.auth().getUserByEmail(email);

        res.status(200).json({ message: 'Sign-in successful', uid: userRecord.uid, email: email, });
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: 'Sign-in failed.' });
    }
});

router.post('/register-email', async (req, res) => {
    const { username, email, password } = req.body;  // Get email, username, and password from request body

    try {
        // Check if the email is already registered
        let user = await User.findOne({ email });
        if (!user) {
            // Create a new user if email is not found
            const uid = new mongoose.Types.ObjectId();  // Generate a unique user ID
            user = new User({
                username,
                email,
                uid,
                password,  // Save the plain password (you might want to hash it using bcrypt)
                balance: 0.00,
                business: 0.00,
                shares: 0.00,
                crypto: 0.00,
                inflationRate: '1.00%',
            });
            await user.save();  // Save the new user in MongoDB
        }

        res.status(200).json({ message: 'User registered successfully', uid: user.uid });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Registration failed.' });
    }
});

router.post('/login-google', async (req, res) => {
    const { token } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid } = decodedToken;

        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({ message: 'User signed in successfully', uid });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

module.exports = router;