const admin = require("firebase-admin");
const User = require("../models/User");
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.post("/register-google", async (req, res) => {
  const { token, username } = req.body;

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email } = decodedToken;

    // Check if user exists in MongoDB
    let user = await User.findOne({ email });
    if (user) {
      // If user exists, return early with the error
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user if not found
    user = new User({
      username: email,
      email: email,
      uid: uid,
      balance: 0.0,
      business: 0.0,
      shares: 0.0,
      crypto: 0.0,
      inflationRate: "1.00%",
    });
    await user.save();

    // Send success response
    return res.status(200).json({
      message: "User registered successfully",
      uid: user.uid,
      email: user.email,
      balance: user.balance,
      business: user.business,
      shares: user.shares,
      crypto: user.crypto,
      inflationRate: user.inflationRate,
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
});

router.post("/login-email", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({
          error:
            "Пользователь с таким email не найден. Пожалуйста, зарегистрируйтесь.",
        });
    }

    if (user.password !== password) {
      return res
        .status(401)
        .json({ error: "Неправильный пароль. Пожалуйста, попробуйте снова." });
    }

    res.status(200).json({
      message: "Sign-in successful",
      uid: user.uid,
      email: user.email,
      balance: user.balance,
      shares: user.shares,
      crypto: user.crypto,
      business: user.business,
      inflationRate: user.inflationRate,
      username: user.username,
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res
      .status(500)
      .json({ error: "Ошибка входа. Пожалуйста, попробуйте снова." });
  }
});

router.post("/register-email", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Create a user in Firebase Authentication
    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });

    // Check if the email is already registered in MongoDB
    let user = await User.findOne({ email });
    if (!user) {
      // Create a new user in MongoDB if email is not found
      const uid = firebaseUser.uid; // Use Firebase's UID
      user = new User({
        username,
        email,
        uid,
        password, // Save the plain password (you might want to hash it using bcrypt)
        balance: 0.0,
        business: 0.0,
        shares: 0.0,
        crypto: 0.0,
        inflationRate: "1.00%",
      });
      await user.save(); // Save the new user in MongoDB
    }

    res
      .status(200)
      .json({
        message: "User registered successfully",
        uid: user.uid,
        username: user.username,
        email: user.email,
        balance: user.balance,
        business: user.business,
        shares: user.shares,
        crypto: user.crypto,
        inflationRate: user.inflationRate,
      });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Registration failed." });
  }
});

router.post("/login-google", async (req, res) => {
  const { token } = req.body;

  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email } = decodedToken;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      message: "User signed in successfully",
      uid: user.uid,
      username: user.username,
      email: user.email,
      balance: user.balance,
      business: user.business,
      shares: user.shares,
      crypto: user.crypto,
      inflationRate: user.inflationRate,
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
