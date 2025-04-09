import { Routes } from '@angular/router';
import { ReservationFormComponent } from './components/reservation-form/reservation-form.component';
import { ListReservationComponent } from './components/list-reservation/list-reservation.component';
export default [

    { path: 'list-reservation', component: ListReservationComponent },
    { path: 'new-reservation', component: ReservationFormComponent },
] as Routes; 