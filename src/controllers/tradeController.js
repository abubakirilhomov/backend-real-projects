const User = require('../models/User');
const Product = require('../models/Product');

// Покупка продукта
exports.buyProduct = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    const totalCost = product.price * quantity;

    if (user.balance < totalCost) {
      return res.status(400).json({ message: 'Недостаточно средств' });
    }

    // Вычитаем сумму из баланса
    user.balance -= totalCost;

    // Добавляем в историю покупок
    user.tradeHistory.push({
      productId: product._id,
      productName: product.name,
      action: 'buy',
      quantity,
      price: product.price,
    });

    await user.save();
    res.json({ message: 'Продукт успешно куплен', balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Продажа продукта
exports.sellProduct = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    const totalGain = product.price * quantity;

    // Добавляем сумму на баланс
    user.balance += totalGain;

    // Добавляем в историю продаж
    user.tradeHistory.push({
      productId: product._id,
      productName: product.name,
      action: 'sell',
      quantity,
      price: product.price,
    });

    await user.save();
    res.json({ message: 'Продукт успешно продан', balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получение истории торговли пользователя
exports.getTradeHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('tradeHistory');
    res.json(user.tradeHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
