import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { OperationList } from './features/operations/operation-list/operation-list';
import { OperationForm } from './features/operations/operation-form/operation-form';
import { OperationDetail } from './features/operations/operation-detail/operation-detail';

export const routes: Routes = [
    { path: '', component: Dashboard },
    { path: 'operations', component: OperationList },
    { path: 'operations/new', component: OperationForm },
    { path: 'operations/:id', component: OperationDetail },
    { path: 'operations/:id/edit', component: OperationForm },
    { path: '**', redirectTo: '' },
];
