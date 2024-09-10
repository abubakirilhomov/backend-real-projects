const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: String,
  productName: String,
  quantity: Number,
  price: Number
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
