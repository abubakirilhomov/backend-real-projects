// controllers/updateProductValues.js
const Product = require("../models/Product"); // Проверьте правильность пути

// Максимальное количество объектов в массиве `values`
const MAX_VALUES_LENGTH = 10;

const updateProductsPeriodically = async () => {
  try {
    // Находим все продукты
    const products = await Product.find();
    console.log("Products found for update:", products);

    // Проходим по каждому продукту
    for (let product of products) {
      // Создаем новое значение
      const newValue = {
        price: getRandomPrice(), // Генерация нового значения
        date: new Date().toISOString().split("T")[0], // Текущая дата в формате YYYY-MM-DD
        time: new Date().toISOString().split("T")[1].split(".")[0], // Текущее время в формате HH:MM:SS
      };

      // Если длина массива `values` превышает MAX_VALUES_LENGTH, удаляем первый элемент
      if (product.values.length >= MAX_VALUES_LENGTH) {
        // Удаляем первый элемент массива
        await Product.findByIdAndUpdate(
          product._id,
          { $pop: { values: -1 } } // Удаляет первый элемент из массива
        );
      }

      // Добавляем новое значение в массив `values`
      await Product.findByIdAndUpdate(
        product._id,
        { $push: { values: newValue } }, // Добавляем новое значение
        { new: true } // Возвращает обновленный документ
      );

      console.log(`Added new value to product ${product._id}:`, newValue);
    }

    console.log("Product values updated successfully");
  } catch (error) {
    console.error("Error updating product values:", error);
  }
};

// Генерация случайной цены для примера
const getRandomPrice = () => Math.floor(Math.random() * 500);

module.exports = { updateProductsPeriodically };
