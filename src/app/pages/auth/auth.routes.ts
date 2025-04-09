import { Routes } from '@angular/router';
import { Login } from './components/login';
import { Register } from './components/register';
import { Profile } from './components/profile';
import { ChangePassword } from './components/change-password';
import { EditProfile } from './components/edit-profile';

export default [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'profile',
    component: Profile
  },
  {
    path: 'profile/edit',
    component: EditProfile
  },
  {
    path: 'profile/change-password',
    component: ChangePassword
  }
] as Routes; 