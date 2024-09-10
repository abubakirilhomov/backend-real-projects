const socketIo = require('socket.io');
const Portfolio = require('../models/Portfolio');

module.exports = (server) => {
  // Initialize socket.io with CORS settings
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  // Handle client connections
  io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle 'getPortfolio' event to fetch and send portfolio data
    socket.on('getPortfolio', async (userId) => {
      try {
        // Fetch portfolio data from the database
        const portfolio = await Portfolio.find({ userId });
        
        // Send portfolio data back to the client
        socket.emit('portfolioUpdate', portfolio);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        
        // Optionally, you can emit an error event to the client
        socket.emit('error', 'Error fetching portfolio');
      }
    });

    // Handle client disconnections
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};
