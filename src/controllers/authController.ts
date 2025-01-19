import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/users';
import { AppError } from '../utils/HandleErrors';
import { logger } from '../utils/logger';
import { ErrorCodes } from '../utils/errorCodes';
import { transporter, MailOptions } from '../config/nodemailer';
import { UserRequest } from '../utils/types';
import { redisClient } from '../config/redis';
import { configDotenv } from 'dotenv';

configDotenv()

const redis = redisClient


interface JwtPayload {
  id: string;
  email: string;
}



class AuthController {
  // Generate JWT Token
  private generateToken(id: string, email: string): string {
    return jwt.sign(
      { id, email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  // Generate Verification Token
  private generateOTP(email: string): string {
   return Math.floor(100000 + Math.random() * 9000).toString();
  }
  async createOTPForEmail(email: string): Promise<string> {
    const otp = this.generateOTP(email);
    
    // Create Redis key using email
    const key = `otp:${email}`;
    
    // Store OTP in Redis with 15 minutes expiration
    const setKey = await redis.set(key, otp, 'EX', 15 * 60); // 15 minutes in seconds
    
    return otp;
  }

  async verifyOTP(email: string, submittedOTP: string) {
    const key = `otp:${email}`;
    
    // Get stored OTP
    const storedOTP = await redis.get(key);
    
    // If no OTP found or doesn't match
    if (!storedOTP || storedOTP !== submittedOTP) {
      return false;
    } 
    
    // Delete the OTP from Redis after successful verification
    await redis.del(key);
    return true
  }


//Send Verification Email
private async sendVerificationEmail (email: string, verificationToken: string ): Promise<void> { 
    const mailOptions: MailOptions = {
        from: process.env.EMAIL_FROM as string,
        to: email,
        subject: "Verification Token",
        text: verificationToken
    }
      try {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
              throw err
          }
          console.log('Email sent ' + info.accepted)
      })
      } catch (err: any) {
        throw new AppError(err.message)
      }
}

  // Register new user
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, phone, password, pin } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { phone }] 
      });

      if (existingUser) {
        if (existingUser.email === email) {
          throw new AppError('Email already registered', 400, ErrorCodes.AUTH_004);
        }
        throw new AppError('Phone number already registered', 400, ErrorCodes.AUTH_002);
      }

      // Create user
      const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        pin
      });

      // Generate verification token
      const verificationToken = await this.createOTPForEmail(email);

      // TODO: Send verification email
      await this.sendVerificationEmail(email, verificationToken);
      

      // Generate JWT
      if(user) {
        const token = this.generateToken(user._id as string, user.email);

        // Remove sensitive data
      const userResponse = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      };

      logger.info(`New user registered: ${email}`);

      res.status(201).json({
        status: 'success',
        message: 'Registration successful. Please verify your email.',
        token,
        data: userResponse
      });
      }
    } catch (error) {
      next(error);
    }
  };

  // Login user
  public login = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Get user with password
      const user = await User.findOne({ email }).select('+password');

      if (!user || !(await user.comparePassword(password))) {
        throw new AppError('Invalid email or password', 401, ErrorCodes.AUTH_002);
      }

      // Check if email is verified
      if (!user.isVerified) {
        throw new AppError('Please verify your email first', 401, ErrorCodes.AUTH_003);
      }

      // Generate token
      const token = this.generateToken(user._id as string, user.email);

      // Remove sensitive data
      const userResponse = {
        id: user._id as string,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      };
      req.user = userResponse;

      logger.info(`User logged in: ${email}`);

      res.status(200).json({
        status: 'success',
        token,
        data: userResponse
      });
    } catch (error) {
      next(error);
    }
  };

  //Auth header insertion
//   public authenticationToken (req: Request, res: Response, next: NextFunction) {
//     const authHeader =  req.headers['authorization']
//     const bearerToken = authHeader && authHeader.split(' ')
//     if ( bearerToken == null) return res.status(400).json({message: "user not authenticated"})
//         jwt.sign(bearerToken, )
//   }

  // Verify email
  public verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { submittedOTP, email } = req.body;
      const tokenVerification: boolean = await this.verifyOTP(email, submittedOTP)

      if (!tokenVerification) {
        throw new AppError('Invalid token or email already verified', 400, ErrorCodes.AUTH_005);
      }
      const findUser = await User.findOne({email})
      if (!findUser) {
        throw new AppError('User not found', 400, ErrorCodes.AUTH_001)
      }
      findUser.isVerified = true;
      findUser.save()

      logger.info(`Email verified for user: ${email}`);

      res.status(200).json({
        status: 'success',
        isverified: findUser.isVerified,
        message: 'Email verified successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // Resend verification email
  public resendVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        throw new AppError('User not found', 404, ErrorCodes.AUTH_002);
      }

      if (user.isVerified) {
        throw new AppError('Email already verified', 400, ErrorCodes.AUTH_004);
      }

      // Generate new verification token
      const verificationToken = await this.createOTPForEmail(email);

      // TODO: Send verification email
      await this.sendVerificationEmail(email, verificationToken);

      logger.info(`Verification email resent to: ${email}`);

      res.status(200).json({
        status: 'success',
        message: 'Verification email sent successfully'
      }); 
    } catch (error) {
      next(error);
    }
  };

  // Request password reset
  // public resetPasswordRequest = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { email } = req.body;

  //     const user = await User.findOne({ email });

  //     if (!user) {
  //       throw new AppError('User not found', 404, ErrorCodes.AUTH_002);
  //     }

  //     // Generate reset token
  //     const resetToken = this.generateOTP(email);

  //     // TODO: Send reset email
  //     await this.sendVerificationEmail(email, resetToken);

  //     logger.info(`Password reset requested for: ${email}`);

  //     res.status(200).json({
  //       status: 'success',
  //       message: 'Password reset instructions sent to your email'
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // Reset password
  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password, email } = req.body;

      // Find user and update password
      const user = await User.findOneAndUpdate(
        { password },
        { new: true }
      );

      if (!user) {
        throw new AppError('Invalid token or user not found', 400, ErrorCodes.AUTH_004);
      }

      logger.info(`Password reset successful for: ${user.email}`);

      res.status(200).json({
        status: 'success',
        message: 'Password reset successful'
      });
    } catch (error) {
      next(error);
    }
  };

  // Get current user
  public getCurrentUser = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user?.id);

      if (!user) {
        throw new AppError('User not found', 404, ErrorCodes.AUTH_002);
      }

      res.status(200).json({
        status: 'success',
        data: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Update user profile
  public updateProfile = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, phone } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user?.id,
        { firstName, lastName, phone },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new AppError('User not found', 404, ErrorCodes.AUTH_002);
      }

      logger.info(`Profile updated for user: ${user.email}`);

      res.status(200).json({
        status: 'success',
        data: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Change password
  public changePassword = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user?.id).select('+password');

      if (!user || !(await user.comparePassword(currentPassword))) {
        throw new AppError('Current password is incorrect', 401, ErrorCodes.AUTH_002);
      }

      user.password = newPassword;
      await user.save();

      logger.info(`Password changed for user: ${user.email}`);

      res.status(200).json({
        status: 'success',
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  };




  // Change PIN
  public changePin = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { currentPin, newPin } = req.body;

      const user = await User.findById(req.user?.id).select('+pin');

      if (!user || !(await user.comparePin(currentPin))) {
        throw new AppError('Current PIN is incorrect', 401, ErrorCodes.AUTH_005);
      }

      user.pin = newPin;
      await user.save();

      logger.info(`PIN changed for user: ${user.email}`);

      res.status(200).json({
        status: 'success',
        message: 'PIN changed successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();