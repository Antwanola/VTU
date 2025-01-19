import axios from 'axios';
import crypto from 'crypto';
import { MONIFY_CONFIG } from '../config/monify';
import { PaymentDetails, PaymentResponse } from '../utils/types/payment';
import { AppError } from '../utils/HandleErrors';
import { logger } from '../utils/logger';
import { TransactionStatus } from '../utils/types/payment';



export class MonifyService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly secretKey: string;
  private readonly contractCode: string;
  accessToken: string | null;
  tokenExpiry: number | null;

  constructor() {
    this.baseUrl = MONIFY_CONFIG.baseUrl;
    this.apiKey = MONIFY_CONFIG.apiKey;
    this.secretKey = MONIFY_CONFIG.secretKey;
    this.contractCode = MONIFY_CONFIG.contractCode;
    this.accessToken = null;
    this.tokenExpiry = null;

    if (!this.apiKey || !this.secretKey || !this.contractCode) {
      throw new AppError('Missing required Monify API credentials');
    }
  }

  private generatePaymentReference(): string {
    return `PAY_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  async initialize() {
    try {
      logger.info('Initializing Monify API connection...');
      const auth = Buffer.from(`${this.apiKey}:${this.secretKey}`).toString('base64');
      logger.info('Authentication header prepared');
      const response = await axios({
        method: 'post',
        url: `${this.baseUrl}/api/v1/auth/login`,
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });

      logger.info('Received auth response', {
        status: response.status,
        hasData: !!response.data,
        requestSuccessful: response.data?.requestSuccessful
      });

      if (!response.data?.requestSuccessful) {
        logger.error('Auth response not successful', response.data);
        throw new AppError('Authentication failed: ' + (response.data?.responseMessage || 'Unknown error'));
      }

      if (!response.data?.responseBody?.accessToken) {
        logger.error('No access token in response', response.data);
        throw new AppError('No access token received');
      }

      this.accessToken = response.data.responseBody.accessToken;
      this.tokenExpiry = new Date().getTime() + (response.data.responseBody.expiresIn * 1000);

      logger.info('Successfully obtained access token', {
        tokenExpiry: new Date(this.tokenExpiry).toISOString(),
        hasToken: !!this.accessToken
      });

      return {
        success: true,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        accessToken: this.accessToken,
        tokenExpiry: this.tokenExpiry,
      };
    } catch (error: any) {
      logger.error('Initialization failed', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new AppError(`Failed to initialize Monify API: ${error.message}`);
    }
  }

  async ensureValidToken() {
    if (!this.accessToken || !this.tokenExpiry || new Date().getTime() >= this.tokenExpiry) {
      const initialized = await this.initialize();
      if (!initialized) {
        throw new AppError('Failed to refresh API token');
      }
    }
    return this.accessToken;
  }

  async getApiClient() {
    await this.ensureValidToken();
    return axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async testConnection() {
    try {
      const client = await this.getApiClient();
      const response = await client.get('/api/v1/banks');
      return response.data.responseMessage;
    } catch (error: any) {
      logger.error('API test connection failed:', error.message);
      return false;
    }
  }

  async initiatePayment(details: PaymentDetails): Promise<PaymentResponse> {
    try {
      await this.ensureValidToken();
      const client = await this.getApiClient();

      const payload = {
        amount: details.amount,
        customerName: details.customerName,
        customerEmail: details.customerEmail,
        paymentReference: details.paymentReference || this.generatePaymentReference(),
        paymentDescription: details.paymentDescription,
        contractCode: this.contractCode,
        redirectUrl: MONIFY_CONFIG.defaultRedirectUrl,
        currency: "NGN"
      };
  
      // Log the payload
      logger.info('Initiating payment with payload:', payload);
  
      const response = await client.post<PaymentResponse>('/api/v1/merchant/transactions/init-transaction', payload);
  
      if (!response.data.requestSuccessful) {
        logger.error('Payment initiation failed with response:', response.data);
        throw new AppError(response.statusText);
      }
  
      logger.info('Payment initiated successfully', {
        reference: payload.paymentReference,
        amount: payload.amount
      });
  
      return response.data;
    } catch (error: any) {
      logger.error('Payment initiation failed', {
        error: error.message,
        details
      });
      throw new AppError(error.message || 'Payment initiation failed');
    }
  }

  async verifyPayment(paymentReference: string): Promise<TransactionStatus> {
    try {
      const client = await this.getApiClient();
      const response = await client.get<TransactionStatus>(
        `/api/v1/merchant/transactions/query/${paymentReference}`
      );

      if (!response.data.requestSuccessful) {
        throw new AppError(response.data.responseMessage);
      }

      logger.info('Payment verification successful', {
        reference: paymentReference,
        status: response.data.responseBody.status
      });

      return response.data;
    } catch (error: any) {
      logger.error('Payment verification failed', {
        error: error.message,
        reference: paymentReference
      });
      throw new AppError(error.message || 'Payment verification failed');
    }
  }

  async validateWebhookSignature(signature: string, payload: string): Promise<boolean> {
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
}

export const monifyService = new MonifyService();