import { Routes } from '@angular/router';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { PaymentDemoComponent } from './components/payment-demo/payment-demo.component';
import { CardFormComponent } from './components/card-form/card-form.component';
import { CardManagementComponent } from './components/card-management/card-management.component';
import { PAYMENT_PROVIDERS } from './services/payment-providers';
export default [
    { 
        path: 'payment-demo', 
        component: PaymentDemoComponent,
        providers: PAYMENT_PROVIDERS
    },
    { 
        path: 'payment-form', 
        component: PaymentFormComponent,
        providers: PAYMENT_PROVIDERS
    },
    {
        path: 'card-form',
        component: CardFormComponent,
        providers: PAYMENT_PROVIDERS
    },
    {
        path: 'card-management',
        component: CardManagementComponent,
        providers: PAYMENT_PROVIDERS
    },
   
] as Routes; 