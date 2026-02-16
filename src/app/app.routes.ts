import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CajaComponent } from './pages/caja/caja.component';
import { roleGuard } from './auth/role.guard';
import { VentaComponent } from './pages/venta/venta.component';
import { VentasAdminComponent } from './pages/ventas-admin/ventas.admin.component';
import { VentasReportesComponent } from './pages/ventas-reportes/ventas.reportes.component';
import { CierresAdminComponent } from './pages/admin/cierres-admin/cierres.admin.component';

export const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },

    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [roleGuard],
        data: { role: 'Admin' }
    },
    {
        path: 'caja',
        component: CajaComponent,
        canActivate: [roleGuard],
        data: { role: 'Cajero' }
    },


    {
        path: 'ventas',
        component: VentaComponent,
        canActivate: [roleGuard],
        data: { role: 'Admin' }
    },

    {
        path: 'ventas-admin',
        component: VentasAdminComponent,
        canActivate: [roleGuard],
        data: { role: 'Admin' }
    },

    {
        path: 'reportes',
        component: VentasReportesComponent,
        canActivate: [roleGuard],
        data: { role: 'Admin' }
    },

    {
        path: 'cierres-admin',
        component: CierresAdminComponent,
        canActivate: [roleGuard],
        data: { role: 'Admin' }
    },

    {
        path: 'dashboard',
        loadComponent: () =>
            import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [roleGuard],
        data: { role: 'Admin' }
    },


    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];