export interface PaymentDetails {
    amount: number;
    customerEmail: string;
    customerName: string;
    paymentReference: string;
    transactionReference?: string;
    paymentDescription: string;
    redirectUrl: string | undefined;
    currencyCode: string | undefined;
    contractCode: string | undefined;
    paymentMethods?: string[]
  }
  export interface ValidationError {
    field: string;
    message: string;
  }
  export interface InitiatePaymentRequest {
    amount: number;
    customerName: string;
    customerEmail: string;
    paymentDescription?: string;
    redirectUrl?: string;
    paymentReference?: string;
  }

  export interface PaymentResponse {
    requestSuccessful: boolean;
    responseMessage: string;
    responseBody: {
      transactionReference: string;
      paymentReference: string;
      merchantName: string;
      apiKey: string;
      redirectUrl: string;
      transactionHash: string;
    };
  }

  export interface MonifyResponse {
    status: boolean;
    message: string;
    data: {
      paymentReference: string;
      transactionReference: string;
      paymentUrl: string;
    };
  }

  export interface TransactionStatus {
    requestSuccessful: boolean;
    responseMessage: string;
    responseBody: {
      transactionReference: string;
      paymentReference: string;
      paymentStatus: string;
      amountPaid: number;
      totalPayable: number;
      paidOn: string;
      paymentDescription?: string;
      settlementAmount: number;
      customer : {
        email: string;
        name: string
      }
    };
  }