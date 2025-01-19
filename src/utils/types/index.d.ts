// types/custom.d.ts
import { Request } from 'express'

export interface UserRequest extends Request {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    isVerified: boolean;
  }
}