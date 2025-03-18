export interface CacheOptions {
    stdTTL?: number;       // Standard TTL in seconds
    checkperiod?: number;  // Time in seconds to check for expired keys
    deleteOnExpire?: boolean;
    useClones?: boolean;
  }

export interface VerificationData {
  email: string;
  token: string;
  expires: number;
}