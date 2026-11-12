import { Routes } from '@angular/router';
import { RolesPage } from './roles-page';
import { UsersPage } from './users-page';

export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UsersPage },
  { path: 'roles', component: RolesPage },
];
