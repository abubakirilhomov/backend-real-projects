const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const socketIo = require("socket.io");
require("dotenv").config();
const admin = require("firebase-admin");
const userRoutes = require("./routes/userRoutes");

// Import routes
const productRoutes = require("./routes/productRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const authRoutes = require("./routes/authRoutes");
const shopRouter = require("./routes/shopRouter");
const { cleanupOldValues } = require("./controllers/productController");
const {
  updateProductsPeriodically,
} = require("./controllers/updateProductValues");

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
const corsOptions = {
  origin: "*",
};
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Adjust this if your frontend is hosted elsewhere
//     methods: "GET,POST,PUT,DELETE",
//     allowedHeaders: "Content-Type,Authorization",
//   })
// );
app.use(cors(corsOptions));
// MongoDB connection
const connectDB = require("./config/db");
const Product = require("./models/Product");
connectDB();

// Create HTTP server and integrate with Socket.io
const server = require("http").createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend origin
    methods: ["GET", "POST"],
  },
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected");

  // Fetch products and send to the client when connected
  const getProducts = async () => {
    try {
      const products = await Product.find();
      socket.emit("updateProducts", products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  getProducts();

  // Periodically send updated product data to all connected clients
  const intervalId = setInterval(async () => {
    try {
      const products = await Product.find();
      io.emit("updateProducts", products);
      console.log("Products updated and sent to clients");
    } catch (error) {
      console.error("Error updating product prices:", error);
    }
  }, 15000); // Every 15 seconds

  // Clear the interval when client disconnects
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(intervalId);
  });
});

// Clean up old values and update product data periodically
setInterval(cleanupOldValues, 5 * 60 * 1000); // Clean up every 5 minutes
setInterval(updateProductsPeriodically, 5000); // Update products every 5 seconds

// const serviceAccount = require("../ServiceAccounts.json");

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Correctly format the private key
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  }),
});

// Define routes
app.use("/api/products", productRoutes);
app.use("/api/trade", tradeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/shop", shopRouter);
app.use("/api/user", userRoutes); // Add this line to use the user routes

// Start the server and listen on the specified port
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
