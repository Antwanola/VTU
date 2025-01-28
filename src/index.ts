import express from 'express';
import helmet from 'helmet';
import { limiter } from './middleware/rateLimiter';
import { connectDB } from './config/database';
import { globalErrorHandler, AppError } from './utils/HandleErrors'; // Import the global error handler
import { logger } from './utils/logger'; // Ensure you have the logger imported
import { corsOptions } from './config/corsOptions';
import cors from "cors"
import router from './routes';
import { redisClient } from './config/redis';
import { MonifyService } from './services/payment';



const app = express();

// Security middleware
app.use(helmet());

// cors
app.use(cors(corsOptions));


// Initialize the connection
const initializeRedis = async () => {
  try {
    redisClient.on('connect', () => {
      logger.info('Redis client connected successfully');
    });

    redisClient.on('ready', () => {
      logger.info('Redis client is ready to use');
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error', err);
    });

    // Optional: Test connection
    const testKey = 'redis:init';
    await redisClient.set(testKey, 'initialized');
    const value = await redisClient.get(testKey);
    logger.info(`Redis test key "${testKey}" has value: ${value}`);
  } catch (err) {
    logger.error('Error during Redis initialization', err);
  }
};
initializeRedis()

// Middleware
app.use(express.json()); // Add JSON body parser
app.use(express.urlencoded({ extended: true })); // Add URL-encoded body parser



// Rate limiting

app.use(limiter);

// Connect to MongoDB
connectDB();

const initializeMonify = async () => {
const monifyService =  new MonifyService()
// await monifyService.initialize()
// await monifyService.testConnection()
}
initializeMonify()

//use routes
app.use("/", router)

// 404 handler (place before global error handler)
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler (must be the last middleware)
app.use(globalErrorHandler);

// Unhandled promise rejections
process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  
  // Graceful shutdown
});

// Uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  
  //Graceful shutdown
  process.exit(1);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;