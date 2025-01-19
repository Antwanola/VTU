import { createTransport } from "nodemailer";
import { configDotenv } from "dotenv";
import { logger } from "../utils/logger";
import { AppError } from "../utils/HandleErrors";

configDotenv()


export const transporter = createTransport({
  host: process.env.EMAIL_HOST, // Replace with your SMTP server host
  port: 587,               // Replace with your SMTP server port (e.g., 587 for TLS, 465 for SSL)
  secure: false,           // Use `true` if the port is 465, otherwise `false`
  auth: {
    user: process.env.EMAIL_USER,  // Replace with your SMTP username
    pass: process.env.EMAIL_PASSWORD,           // Replace with your SMTP password
  },
});


 async function verifyTransporterConnection() {
  try {
    console.log(process.env.EMAIL_USER)
    await transporter.verify()
    logger.info("Email service connection established")
  } catch (error: any) {
    logger.error('Email service connection failed:', error);
    throw new AppError(`Email service connection failed: ${error.message}`, 500)
  }
}

verifyTransporterConnection()
export interface MailOptions {
  from: string
  to: string
  subject: string
  text: string
}
