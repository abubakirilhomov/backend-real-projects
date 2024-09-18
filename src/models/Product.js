// models/Product.js
const mongoose = require('mongoose');

const valueSchema = new mongoose.Schema({
  price: Number,
  date: String,
  time: String
});

const productSchema = new mongoose.Schema({
  name: String,
  type: String,
  values: [valueSchema]
});

module.exports = mongoose.model('Product', productSchema);
