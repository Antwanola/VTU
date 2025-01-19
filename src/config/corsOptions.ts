import { CorsOptions } from 'cors';
import { configDotenv } from 'dotenv';
configDotenv()

export const corsOptions: CorsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600, // 10 minutes
  exposedHeaders: ['Authorization', 'Content-Type']
};

