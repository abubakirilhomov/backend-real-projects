const express = require('express');
const { buyProduct, sellProduct, getTradeHistory } = require('../controllers/tradeController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/buy', protect, buyProduct);
router.post('/sell', protect, sellProduct);
router.get('/history', protect, getTradeHistory);

module.exports = router;
