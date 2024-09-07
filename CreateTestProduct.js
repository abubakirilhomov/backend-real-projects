const mongoose = require('mongoose'); // Импортируем mongoose
const Product = require('./src/models/Product'); // Импортируем модель продукта
const connectDB = require('./src/config/db'); // Импортируем функцию подключения к MongoDB

// Подключаемся к базе данных
connectDB();

// Функция для генерации случайной цены
const generateRandomPrice = (min = 10, max = 500) => Math.floor(Math.random() * (max - min + 1)) + min;

// Создаем продукт с динамическими значениями
const createProductData = (name, type) => {
  const now = new Date();
  const values = [];

  // Создаем записи за последние 5 минут
  for (let i = 0; i < 6; i++) {
    const date = new Date(now.getTime() - (i * 5000)); // 5 секунд интервал
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = date.toTimeString().split(' ')[0];

    values.push({
      price: generateRandomPrice(),
      date: formattedDate,
      time: formattedTime
    });
  }

  return {
    name,
    type, // Используем 'type' вместо 'productType'
    values
  };
};

// Пример продуктов
const products = [
  createProductData('Bitcoin', 'Crypto'),
  createProductData('Ethereum', 'Crypto'),
  createProductData('Company X', 'Company'),
  createProductData('Company Y', 'Company')
];

// Функция для создания продуктов
async function createProducts() {
  try {
    await Product.deleteMany(); // Очищаем коллекцию перед созданием

    for (const product of products) {
      const newProduct = new Product(product);
      await newProduct.save();
    }

    console.log("Продукты успешно созданы");
    process.exit(); // Завершаем выполнение скрипта
  } catch (error) {
    console.error("Ошибка при создании продуктов:", error);
    process.exit(1); // Завершаем выполнение с ошибкой
  }
}

createProducts();
