import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import { MONIFY_CONFIG } from '../config/monify';
import { PaymentDetails, PaymentResponse } from '../utils/types/payment';
import { AppError } from '../utils/HandleErrors';
import { logger } from '../utils/logger';
import { TransactionStatus } from '../utils/types/payment';
import { Transaction } from '../models/transactions';

export class MonifyService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly secretKey: string;
  private readonly contractCode: string;
  private accessToken: string | null;
  private tokenExpiry: number | null;
  private axiosInstance: AxiosInstance | null;

  constructor() {
    // Validate config at construction time
    if (!MONIFY_CONFIG.baseUrl || !MONIFY_CONFIG.apiKey || 
        !MONIFY_CONFIG.secretKey || !MONIFY_CONFIG.contractCode) {
      throw new AppError('Missing required Monify configuration parameters');
    }

    this.baseUrl = MONIFY_CONFIG.baseUrl;
    this.apiKey = MONIFY_CONFIG.apiKey;
    this.secretKey = MONIFY_CONFIG.secretKey;
    this.contractCode = MONIFY_CONFIG.contractCode;
    this.accessToken = null;
    this.tokenExpiry = null;
    this.axiosInstance = null;
  }

  private generatePaymentReference(): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    return `PAY_${timestamp}_${random}`;
  }

  private validatePaymentDetails(details: PaymentDetails): void {
    if (!details.amount || details.amount <= 0) {
      throw new AppError('Invalid payment amount');
    }
    if (!details.customerEmail || !details.customerName) {
      throw new AppError('Customer details are required');
    }
    if (!details.paymentDescription) {
      throw new AppError('Payment description is required');
    }
  }

  async initialize() {
    try {
      logger.info('Initializing Monify API connection...');
      
      const auth = Buffer.from(`${this.apiKey}:${this.secretKey}`).toString('base64');
      
      const response = await axios({
        method: 'post',
        url: `${this.baseUrl}/api/v1/auth/login`,
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });

      const { data } = response;

      if (!data?.requestSuccessful || !data?.responseBody?.accessToken) {
        throw new AppError(
          `Authentication failed: ${data?.responseMessage || 'Invalid response format'}`
        );
      }

      this.accessToken = data.responseBody.accessToken;
      this.tokenExpiry = Date.now() + ((data.responseBody.expiresIn || 3600) * 1000);

      // Create new axios instance with token
      this.axiosInstance = axios.create({
        baseURL: this.baseUrl,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      logger.info('Successfully initialized Monify API connection');
      
      return true;
    } catch (error: any) {
      logger.error('Monify initialization failed', {
        error: error.message,
        response: error.response?.data
      });
      throw new AppError(
        `Failed to initialize Monify API: ${error.response?.data?.responseMessage || error.message}`
      );
    }
  }

  async ensureValidToken(): Promise<void> {
    const tokenExpired = !this.tokenExpiry || Date.now() >= this.tokenExpiry;
    const tokenMissing = !this.accessToken;

    if (tokenExpired || tokenMissing) {
      await this.initialize();
    }
  }

  async getApiClient(): Promise<AxiosInstance> {
    await this.ensureValidToken();
    
    if (!this.axiosInstance) {
      throw new AppError('API client not initialized');
    }
    
    return this.axiosInstance;
  }

  async initiatePayment(details: PaymentDetails): Promise<PaymentResponse> {
    try {
      // Validate payment details
      this.validatePaymentDetails(details);

      const client = await this.getApiClient();

      const payload:PaymentDetails = {
        amount: details.amount,
        customerName: details.customerName,
        customerEmail: details.customerEmail,
        paymentReference: this.generatePaymentReference(),
        paymentDescription: details.paymentDescription,
        contractCode: this.contractCode,
        redirectUrl: MONIFY_CONFIG.defaultRedirectUrl,
        currencyCode: "NGN",
        paymentMethods: details.paymentMethods
      };

      logger.info('Initiating payment:', { 
        reference: payload.paymentReference,
        amount: payload.amount,
        customer: payload.customerEmail 
      });

      const response = await client.post<PaymentResponse>(
        '/api/v1/merchant/transactions/init-transaction', 
        payload,
      );

      if (!response.data.requestSuccessful) {
        throw new AppError(
          `Payment initiation failed: ${response.data.responseMessage}`
        );
      }

      logger.info('Payment initiated successfully', {
        reference: payload.paymentReference,
        status: response.data.responseMessage
      });

      return response.data;

    } catch (error: any) {
      logger.error('Payment initiation failed', {
        error: error,
        details: {
          customer: details.customerEmail,
          amount: details.amount
        }
      });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        `Payment initiation failed: ${error.response?.data?.responseMessage || error.message}`
      );
    }
  }

  async verifyPayment(paymentReference: string): Promise<TransactionStatus> {
    const encodedReference = encodeURIComponent(paymentReference);
    if (!paymentReference) {
      throw new AppError('Payment reference is required');
    }

    try {
      const client = await this.getApiClient();
      const response = await client.get<TransactionStatus>(
        `/api/v2/transactions/${encodedReference}`
      );
      console.log({response: response.data.responseMessage})

      if (response.data.responseMessage !=='success' ) {
        throw new AppError(
          `Payment verification failed: ${response.data.responseMessage}`
        );
      }

      logger.info('Payment verification successful', {
        reference: paymentReference,
        status: response.data.responseBody?.paymentStatus
      });

      return response.data;

    } catch (error: any) {
      logger.error('Payment verification failed', {
        error: error,
        reference: paymentReference
      });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        `Payment verification failed: ${error.response?.data?.responseMessage || error.message}`
      );
    }
  }

  async validateWebhookSignature(signature: string, payload: string): Promise<boolean> {
    if (!signature || !payload) {
      return false;
    }

    try {
      const computedSignature = crypto
        .createHmac('sha512', this.secretKey)
        .update(payload)
        .digest('hex');
      
      return computedSignature === signature;
    } catch (error: any) {
      logger.error('Webhook signature validation failed', {
        error: error.message
      });
      return false;
    }
  }

  public checkPaymentStatus = async (transactionReference: string): Promise<boolean> => {
    const client = await this.getApiClient();
    const encodedReference = encodeURIComponent(transactionReference);
    const paymentGatewayApiUrl = `${this.baseUrl}/api/v2/transactions/${encodedReference}`// Replace with your API URL
  // console.log({paymentGatewayApiUrl})
    const maxAttempts = 10; // Set a maximum number of attempts
    let attempts = 0;
  
    while (attempts < maxAttempts) {
      try {
        const response = await client.get(paymentGatewayApiUrl);
        console.log({checkRes:response.data})
        const status = response.data.paymentStatus;
  
        if (status === 'PAID') {
          logger.info("payment successful",{transactionReference: status})
          return true;
        } else if (status === 'failed') {
          console.log('Payment failed.');
          return false;
        } else if (status === 'pending') {
          console.log('Payment pending. Checking again in 5 seconds...');
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        } else {
          console.log(`Unknown status: ${status}. Checking again in 5 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        }
  
      } catch (error) {
        console.error('Error checking payment status:', error);
        // Handle the error appropriately, e.g., retry, log, or notify
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
      }
  
      attempts++;
    }
  
    console.log(`Maximum attempts (${maxAttempts}) reached. Payment status could not be determined.`);
    return false; // Or throw an error if you prefer
  }
}

export const monifyService = new MonifyService();