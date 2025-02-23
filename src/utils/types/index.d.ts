// express.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
   export interface UserRequest extends Request {
      user?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        role: string;
        isVerified: boolean;
      };
    }
  }
}

// Export the type for reuse
export type { UserRequest };