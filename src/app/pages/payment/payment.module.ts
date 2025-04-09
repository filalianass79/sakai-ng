import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { InputMaskModule } from 'primeng/inputmask';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

// Components
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { PaymentDemoComponent } from './components/payment-demo/payment-demo.component';
import { CardFormComponent } from './components/card-form/card-form.component';
import { CardManagementComponent } from './components/card-management/card-management.component';

// Services
import { PaymentService } from './services/payment.service';
import { StripeService } from './services/stripe.service';
import { PaypalService } from './services/paypal.service';

const routes: Routes = [
  {
    path: '',
    component: PaymentDemoComponent
  },
  {
    path: 'cards',
    component: CardManagementComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    
    // PrimeNG Modules
    ButtonModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    SelectButtonModule,
    ToastModule,
    TableModule,
    CheckboxModule,
    InputMaskModule,
    TooltipModule,
    
    // Standalone Components
    PaymentFormComponent,
    PaymentDemoComponent,
    CardFormComponent,
    CardManagementComponent
  ],
  providers: [
    MessageService,
    PaymentService,
    StripeService,
    PaypalService
  ],
  exports: [
    PaymentFormComponent,
    CardFormComponent,
    CardManagementComponent
  ]
})
export class PaymentModule { } 