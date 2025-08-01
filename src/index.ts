import express from 'express';
import helmet from 'helmet';
import { limiter } from './middleware/rateLimiter';
import { connectDB } from './config/database';
import { globalErrorHandler, AppError } from './utils/HandleErrors'; // Import the global error handler
import { logger } from './utils/logger'; // Ensure you have the logger imported
import cors from "cors"
import router from './routes';
import path from 'path';
import { dataService } from './services/VTU_data/gladtidings';
import { quickTellerService } from './services/quickTeller';
import { seedData } from './utils/seeData';
import { GsubzService } from './services/VTU_data/gsubz';
import { corsOptions } from './config/corsOptions';


const app = express();

// Security middleware
app.use(helmet());

// cors
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));




// Rate limiting

app.use(limiter);

// Connect to MongoDB
connectDB();

// const  initQuick = async () => {
//  quickTellerService.handleQuickteller()
// }
// initQuick()

// const seed = async () => {
//   await seedData()
// }

const callGSubzService = async() => {
  const service = new  GsubzService();
   const daa = await service.getAllServicesBYProvider("airtel");
}
callGSubzService()

// const initializeGladTidings = async () => {
//   await dataService.initialize()
//   await dataService.findData("AIRTEL_PLAN", "1.0GB", "30 days")
// }
// initializeGladTidings()

//Trust proxy for test
app.set('trust proxy', 1);


//use routes
app.use("/", limiter, router)

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