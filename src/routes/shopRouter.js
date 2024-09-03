const express = require('express');
const { getAllShop, createShop, getShopById, deleteShop, updateShop } = require('../controllers/Shop');
const router = express.Router();

// Get all shops
router.get('/all', async (req, res) => {
    try {
        const shops = await getAllShop();
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific shop by ID
router.get('/:id', async (req, res) => {
    try {
        const shopId = req.params.id;
        const shop = await getShopById(shopId);

        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        res.status(200).json({ data: shop });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new shop
router.post('/create', async (req, res) => {
    try {
        const { type_shop, product_name, description, price, product_type } = req.body;
        const newShop = await createShop(type_shop, product_name, description, price, product_type);
        res.status(201).json(newShop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a shop by ID
router.put('/update/:id', async (req, res) => {
    try {
        const shopId = req.params.id;
        const updatedData = req.body;

        const updatedShop = await updateShop(shopId, updatedData);
        if (!updatedShop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        res.status(200).json({ message: "Shop updated successfully", data: updatedShop });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const shopId = req.params.id;
        const deletedShop = await deleteShop(shopId);

        if (!deletedShop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        res.status(200).json({ message: "Shop deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

