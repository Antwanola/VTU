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
import bcrypt from 'bcryptjs';
import { get } from 'http';
import { promises } from 'dns';

configDotenv()

const redis = redisClient


interface JwtPayload {
  id: string;
  email: string;
}



class AuthController {
  
  // Generate JWT Token
  private generateToken(user: Object): string {
    if (!process.env.JWT_SECRET)  throw new Error('JWT_SECRET is not defined in environment variables');
    return jwt.sign(
      {user},
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  // Generate Verification Token.
  private generateOTP(): string {
   return Math.floor(100000 + Math.random() * 9000).toString();
  }
  async createOTPForEmail(email: string): Promise<string> {
    const otp = this.generateOTP();
    
    // Create Redis key using email
    const key = `otp:${email}`;
    
    // Store OTP in Redis with 15 minutes expiration
    const setKey = await redis.set(key, otp, 'EX', 15 * 60); // 15 minutes in seconds
    
    if (setKey !== "OK") {
      throw new AppError('Failed to generate OTP', 500, ErrorCodes.AUTH_005);
    }
    const storedOTP = await redis.get(key);
    if (storedOTP !== otp) {
      throw new AppError('Failed to generate OTP', 500, ErrorCodes.AUTH_005);
    }
    return storedOTP
  }

  async verifyOTP(email: string, submittedOTP: string): Promise<boolean> {
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
private async sendVerificationEmail (email: string, verificationToken: string, context?: string ): Promise<void> { 
    const mailOptions: MailOptions = {
        from: process.env.EMAIL_FROM as string,
        to: email,
        subject: "Verification Token",
        text: `${context}: ${verificationToken}`
    }
      try {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
              throw err
          }
          logger.info('Verification email sent to: ' + info.accepted)
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
      if (typeof verificationToken !== 'string' || verificationToken.length !== 6) {
        throw new AppError('Failed to generate verification token', 500, ErrorCodes.AUTH_005);
      }

      // TODO: Send verification email
      await this.sendVerificationEmail(email, verificationToken, "User verification Token");
      

      // Generate JWT
      if(user) {
        const token = this.generateToken(user);

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
      const oldPass = user?.password
      if (!user || !(await user.comparePassword(password as string))) {
        throw new AppError('Invalid email or password', 401, ErrorCodes.AUTH_002);
      }

      // Check if email is verified
      if (!user.isVerified) {
        throw new AppError('Please verify your email address first', 401, ErrorCodes.AUTH_003);
      }

      // Generate token
      const token = this.generateToken(user);
      console.log(token)

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

    // Auth header validation and JWT verification
    public async authenticationToken(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
      // Extract the Authorization header
      const authHeader = req.headers['authorization'];
  
      // Check if the Authorization header exists and is in the correct format
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'User not authenticated' });
      }
  
      // Extract the token from the Authorization header
      const token = authHeader.split(' ')[1]; // "Bearer <token>"
      
  
      // Check if the token exists
      if (!token) {
        res.status(401).json({ message: 'User not authenticated' });
      }

      // Verify the JWT
      jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
        if (err) {
          res.status(403).json({ message: 'Invalid or expired token' });
        }
  
        // Attach the decoded user information to the request object
        req.user = user;
  
        // Proceed to the next middleware or route handler
        next();
      });
    }


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
  //Send verification
  public sendVerification = async ( req: Request, res: Response, next: NextFunction ): Promise<void> => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        throw new AppError('User not found', 404, ErrorCodes.AUTH_002);
      }
      const verificationToken = await this.createOTPForEmail(email);
      if (typeof verificationToken !== 'string' || verificationToken.length !== 6) {
        throw new AppError('Failed to generate verification token', 500, ErrorCodes.AUTH_005);
      }
      await this.sendVerificationEmail(email, verificationToken, 'Reset token');
      logger.info(`Verification email sent to: ${email}`);
      res.status(200).json({
        status: 'success',
        message: 'Verification email sent successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Resend verification email
  public verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        throw new AppError('User not found. Please register', 404, ErrorCodes.AUTH_002);
      }

      if (user.isVerified) {
        throw new AppError('Email already verified', 200, ErrorCodes.AUTH_004);
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
  public resetPasswordRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        throw new AppError('User not found', 404, ErrorCodes.AUTH_002);
      }

      // Generate reset token
      const resetToken = this.generateOTP();

      // TODO: Send reset email
      await this.sendVerificationEmail(email, resetToken, 'Reset token');

      logger.info(`Password reset requested for: ${email}`);
      next(resetToken)
    } catch (error) {
      next(error);
    }
  };

  // Reset password
  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password, email } = req.body;
      if (!password || !email) {
        throw new AppError('Password and email are required', 400, ErrorCodes.AUTH_001);
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      

      // Find user and update password
      const user = await User.findOneAndUpdate(
        { email },
        { $set: {hashedPassword} },
        { new: true }
      );

      if (!user) {
        throw new AppError('Invalid token or user not found', 400, ErrorCodes.AUTH_004);
      }
      await user.save()

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

  //Get profile
  public getUserProfile = async ( req: UserRequest, res: Response, next: NextFunction): Promise<void> => {

    try {
      const user = req.user;
      const searchUser = await User.findById(user?.id)
      if (!searchUser) {
        throw new AppError('User not found', 404, ErrorCodes.AUTH_002);
      }
      res.status(200).json({
        status: 'success',
        data: searchUser
    })
    } catch (error) {
      next(error)
    }
  }
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
      if (!currentPassword || !newPassword) {
        throw new AppError('Current password and new password are required', 400, ErrorCodes.AUTH_001);
      }
      if (currentPassword === newPassword) {
        throw new AppError('New password cannot be the same as current password', 400, ErrorCodes.AUTH_001);
      }

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

  public resetPasswordWithToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, submittedOTP, newPassword } = req.body;

    // Verify the reset token (OTP)
    const isTokenValid = await this.verifyOTP(email, submittedOTP);

    if (!isTokenValid) {
      throw new AppError('Invalid or expired token', 400, ErrorCodes.AUTH_005);
    }

    // Find the user
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError('User not found', 404, ErrorCodes.AUTH_002);
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    logger.info(`Password reset successful for: ${email}`);

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};
public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resetCode, newPass, confirmPass, email } = req.body;

    if (!resetCode || !newPass || !confirmPass) {
      throw new AppError ("make sure the fields has valid values")
    }

    // Check if the user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AppError('User not found', 404, ErrorCodes.AUTH_002);
    }
    const verifyToken = this.verifyOTP(email, resetCode)
    if (!verifyToken) {
      throw new AppError("token not verified or invalid token")
    }

    if (newPass !==  confirmPass) {
      throw new AppError("make sure both fields are the same")
    }

    const new_pass = await user.comparePassword(newPass)
    if (new_pass) {
      throw new AppError("new password cannot be the same as the old password")
    }
    user.password = newPass;
    const saved = await user.save()
    logger.info( `Password reset successful for: ${email}`)
    res.status(200).json({
      status: 'success',
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};

public isAdmin = async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const getUser = await User.findOne(user?.email)
    if (!getUser) {
      throw new AppError('User not found', 404, ErrorCodes.AUTH_002);
    }
    
    if (getUser.role !== 'admin') {
      throw new AppError('Unauthorized. User not admin', 401, ErrorCodes.AUTH_006);
    }
    req.user.role = getUser.role
    next()

  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}
public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.find()
    if (!user) {
      throw new AppError("couldn't find user")
    }
    res.json(user)
  } catch (error: any) {
    res.json(error.message)
  }
}

}

export const authController = new AuthController();