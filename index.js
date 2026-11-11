import http from 'http';
import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();
import connectDb from './src/Utils/DbConfig.js';


const server = http.createServer(app);
const PORT = process.env.PORT;
const startServer = async () => {
  try {
    connectDb();
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`User Service running on ${PORT} ✅ 🚀`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();