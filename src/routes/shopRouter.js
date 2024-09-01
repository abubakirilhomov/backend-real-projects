const express = require('express');
const { getAllShop, createShop, getShopById, deleteShop } = require('../controllers/Shop');
const router = express.Router();

router.get('/all', async (req, res) => {
    try {
        const shops = await getAllShop();
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const shopId = req.bady.id;
        console.log(req.params);
        const shop = await getShopById(shopId);

        if (!shop) {
            return res.status(404).json({ message: "Shop not found" });
        }

        res.status(200).json({ data: shop });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/create', async (req, res) => {
    try {
        const { type_shop, product_name, description, price, product_type } = req.body;
        const newShop = await createShop(type_shop, product_name, description, price, product_type);
        res.status(201).json(newShop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete('/delete', async (req, res) => { 
    try {
        const shop_id = req.params.shop_id;
        const deletedShop = await deleteShop(shop_id);
        res.status(201).json({message: "Shop deleted successfully"})
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;
