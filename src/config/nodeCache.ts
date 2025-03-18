import NodeCache from "node-cache";
import { CacheOptions } from '../utils/types/cacheOptions';

class Cache {
  private cache: NodeCache
  constructor (options: CacheOptions = {}) {
    this.cache = new NodeCache({
      stdTTL: options.stdTTL || 900,
      checkperiod: options.checkperiod || 60,
      deleteOnExpire: options.deleteOnExpire !== false,
      useClones: options.useClones !== false
    })

     // Optional: Setup event listeners
     this.cache.on('expired', (key, value) => {
      console.log(`Cache entry expired: ${key}`);
    });
  }

  /**
   * Store value in cache
   * @param key - The cache key
   * @param value - The cache value
   * @param ttl - The time to live in seconds(optional)
   * @returns True on success
   */
  set<T>(key: string, value: T, ttl: number):boolean {
    return this.cache.set(key, value, ttl)
  }
  /**
   * Retrieve a value from the cache
   * @param key - The cache key
   * @return the stored value or undefined if not found
   */
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key)
  }
  /**
   * Check if a key exists in cache and is not expired
   * @param key - The cache key
   * @returns true if the key exists, false otherwise
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }
  /**
   * Delete a key from cache
   * @param key - The cache key or array of keys to delete
   * @returns Number of deleted entries
   */
  delete(key: string | string[]): number {
    return this.cache.del(key);
  }

   /**
   * Clear all keys from cache
   */
   clear(): void {
    this.cache.flushAll();
  }

  /**
   * Get cache statistics
   */
  getStats(): NodeCache.Stats {
    return this.cache.getStats();
  }

  /**
   * Get all cache keys
   */
  keys(): string[] {
    return this.cache.keys();
  }

  /**
   * Get all cache key-value pairs
   * @returns Record with all key-value pairs
   */
  getAll<T>(): Record<string, T> {
    return this.cache.mget<T>(this.cache.keys());
  }

  /**
   * Set default TTL for future entries
   * @param ttl - Time to live in seconds
   */
  setDefaultTTL(ttl: number): void {
    this.cache.options.stdTTL = ttl;
  }
}

// Export a singleton instance with default options
export const cache = new Cache();

// Also export the class for custom instances
export default Cache;
