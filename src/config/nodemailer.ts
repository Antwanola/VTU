import { createTransport } from "nodemailer";
import { configDotenv } from "dotenv";
import { logger } from "../utils/logger";
import { AppError } from "../utils/HandleErrors";

configDotenv();

export const transporter = createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com", // Use Gmail SMTP host
  port: 465, // SSL port for Gmail
  secure: true, // Set true for port 465
  auth: {
    user: process.env.EMAIL_USER, // Gmail address
    pass: process.env.GOOGLE_APP_PASS, // Gmail App Password
  },
  debug: true, // Enable debugging output
  logger: true, // Log SMTP activity
});

async function verifyTransporterConnection() {
  try {
    // Verify connection
    await transporter.verify();
    logger.info("Email service connection established");
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
