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

declare global {
  namespace Express {
    export interface DataRequest extends UserRequest {
      data?: {
        id?: string;
        network: string;
        plan: string;
        duration: string;
      };
    }
  }
}

// Export the type for reuse
export type { UserRequest, DataRequest };