export enum PaymentMethod {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  APPLE_PAY = 'APPLE_PAY',
  GOOGLE_PAY = 'GOOGLE_PAY'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

export interface Transaction {
  id: string;
  externalId?: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
  errorMessage?: string;
  userId?: string;
  entityType?: string;
  entityId?: string;
}

export interface PaymentInitRequest {
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  entityType?: string;
  entityId?: string;
}

export interface PaymentProcessRequest {
  paymentToken: string;
  transactionId: string;
} 