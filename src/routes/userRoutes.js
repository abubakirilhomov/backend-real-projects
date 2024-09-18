const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/save-balance', async (req, res) => {
  const { user, balance } = req.body; 

  try {
    const existingUser = await User.findById(user._id);

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    existingUser.balance = balance;
    await existingUser.save();

    // Send success response
    res.status(200).json({ message: 'Balance saved successfully', balance: existingUser.balance });
  } catch (error) {
    console.error('Error saving balance:', error);
    res.status(500).json({ message: 'Error saving balance' });
  }
});

module.exports = router;
