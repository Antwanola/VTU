import { createTransport } from "nodemailer";
import { configDotenv } from "dotenv";
import { logger } from "../utils/logger";
import { AppError } from "../utils/HandleErrors";

configDotenv();

export const transporter = createTransport({
  host: process.env.EMAIL_HOST, // Replace with your SMTP server host
  port: 465,               // Replace with your SMTP server port (e.g., 587 for TLS, 465 for SSL)
  secure: true,           // Use `true` if the port is 465, otherwise `false`
  auth: {
    user: process.env.EMAIL_USER,  // Replace with your SMTP username
    pass: process.env.GOOGLE_APP_PASS,           // Replace with your SMTP pass
  
  },
  debug: true, // Enable debugging output
  logger: true, // Log SMTP activity
});

async function verifyTransporterConnection() {
  try {

    await transporter.verify()
    logger.info("Email service connection established")

    // Verify connection
    await transporter.verify();
    logger.info("Email service connection establish")
  } catch (error: any) {
    logger.error("Email service connection failed:", error);
    throw new AppError(
      `Email service connection failed: ${error.message}`,
      500
    );
  }
}

// Immediately test the connection
verifyTransporterConnection();

// Define MailOptions interface for sending emails
export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}
