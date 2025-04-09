import { MessageService } from 'primeng/api';
import { PaymentService } from './payment.service';
import { StripeService } from './stripe.service';
import { PaypalService } from './paypal.service';

/**
 * Shared providers for payment-related components
 * This makes it easier to maintain consistent service instances across components
 */
export const PAYMENT_PROVIDERS = [
  MessageService,
  PaymentService,
  StripeService,
  PaypalService
]; 