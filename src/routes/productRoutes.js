// routes/productRoutes.js
const express = require('express');
const {
  getAllProducts,
  createProduct,
  deleteAllProducts
} = require('../controllers/productController');
const router = express.Router();

// Получение всех продуктов
router.get('/', getAllProducts);

// Добавление нового продукта
router.post('/', createProduct);

// Удаление всех продуктов
router.delete('/', deleteAllProducts);

module.exports = router;
