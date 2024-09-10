// server.js или app.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const socketIo = require("socket.io");
require("dotenv").config();

// Импорт маршрутов
const productRoutes = require("./routes/productRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const authRoutes = require("./routes/authRoutes");
const { cleanupOldValues } = require("./controllers/productController");
const {
  updateProductsPeriodically,
} = require("./controllers/updateProductValues");

// Инициализация express
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Подключение к MongoDB
const connectDB = require("./config/db");
const Product = require("./models/Product");
connectDB();

// Определение маршрутов
app.use("/api/products", productRoutes);
app.use("/api/trade", tradeRoutes);
app.use("/api/auth", authRoutes);

// Создание сервера и интеграция с socket.io
const server = require("http").createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Обработка подключений socket.io
io.on("connection", (socket) => {
  console.log("New client connected");

  // Получение продуктов при подключении
  const getProducts = async () => {
    try {
      const products = await Product.find();
      socket.emit("updateProducts", products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  getProducts();

  // Отправка обновленных данных клиентам каждые 5 секунд
  const intervalId = setInterval(async () => {
    try {
      const products = await Product.find();
      io.emit("updateProducts", products);
      console.log("Products updated and sent to clients");
    } catch (error) {
      console.error("Error updating product prices:", error);
    }
  }, 15000);

  // Очистка интервала при отключении клиента
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(intervalId);
  });
});

// Очистка старых записей каждые 5 минут
setInterval(cleanupOldValues, 5 * 60 * 1000);

// Запуск обновления данных продуктов каждые 5 секунд
setInterval(updateProductsPeriodically, 5000);

// Запуск сервера
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
