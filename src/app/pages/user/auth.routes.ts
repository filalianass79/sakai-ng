import { Routes } from '@angular/router';

import { UserList } from './components/user-list';
import { UserDetail } from './components/user-detail';
import { UserEdit } from './components/user-edit';
import { UserNew } from './components/user-new';
export default [
  {
    path: 'list-users',
    component: UserList
  },
  {
    path: 'detail-users/:id',
    component: UserDetail
  },
  {
    path: 'edit-users/:id',
    component: UserEdit
  },
  {
    path: 'new-users',
    component: UserNew
  }
  ] as Routes; 