import { CorsOptions } from 'cors';
import { configDotenv } from 'dotenv';
configDotenv()

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []; // ✅ Lowercase to match usage

export const corsOptions = {
  origin: (origin:any, callback:any) => {
    console.log("CORS request from:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: Origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

