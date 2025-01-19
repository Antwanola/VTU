import Redis from 'ioredis';
import { logger } from '../utils/logger';

export const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000); // Exponential backoff
    return delay;
  },
});

redisClient.on('connect', () => {
  console.log('Redis is connected successfully')
})

redisClient.on('Ready', () => {
  logger.info('Redis client is ready')
})

redisClient.on('error', (err) => {
  logger.error('Redis Client Error', err);
});

