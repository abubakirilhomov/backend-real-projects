// controllers/productController.js
const Product = require('../models/Product');

// Получение всех продуктов
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Добавление нового продукта
exports.createProduct = async (req, res) => {
  const { type, name, price } = req.body;
  try {
    const now = new Date();
    const newValue = {
      price,
      date: now.toLocaleDateString(),
      time: now.toTimeString().split(' ')[0]
    };

    let product = await Product.findOne({ type, 'values.name': name });

    if (product) {
      // Добавляем новую цену к существующему продукту
      product.values.forEach((value) => {
        if (value.name === name) {
          value.value.push(newValue);
        }
      });
    } else {
      // Создаем новый продукт
      product = new Product({
        type,
        values: [
          {
            name,
            value: [newValue]
          }
        ]
      });
    }

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Удаление старых записей
exports.cleanupOldValues = async () => {
  try {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 5 * 60 * 1000); // 5 минут назад

    const products = await Product.find();

    products.forEach(async (product) => {
      product.values.forEach((value) => {
        value.value = value.value.filter(record => new Date(`${record.date} ${record.time}`) > cutoff);
      });
      await product.save();
    });

    console.log("Old values cleaned up");
  } catch (error) {
    console.error("Error cleaning up old values:", error);
  }
};

// Удаление всех продуктов
exports.deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ message: 'All products deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
