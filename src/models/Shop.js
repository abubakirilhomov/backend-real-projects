const mongoose = require('mongoose');

// Define the schema for shop products
const ShopSchema = new mongoose.Schema({
    type_shop: {
        type: String,
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    product_type: []
});

// Create the Shop model using the schema
const Shop = mongoose.model('Shop', ShopSchema);

module.exports = Shop;
