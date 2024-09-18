const Alpaca = require("@alpacahq/alpaca-trade-api");

const alpaca = new Alpaca({
  keyId: process.env.ALPACA_API_KEY,
  secretKey: process.env.ALPACA_API_SECRET,
  paper: true, // Используем демо-счет Alpaca
  usePolygon: false,
});

module.exports = alpaca;
