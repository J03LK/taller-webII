import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';

import { InfraestructuraComponent } from './pages/infraestructura/infraestructura.component';
import { loginGuard } from './guards/login.guard';
import { TabladenunciasComponent } from './components/tablaDenuncias/tabladenuncias.component';
import { SuggestionBoxComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { ocultarGuard } from './guards/ocultar.guard';



export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },

    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'denuncias',
        component: DashboardComponent,
        canActivate: [loginGuard],
        canMatch: [ocultarGuard],
        data: { roles: ['estudiantes'] }
    },
    {
        path: 'nosotros',
        component: NosotrosComponent
    },
    {
        path: 'tabla-denuncias',
        component: TabladenunciasComponent

    },
    {
        path: 'admin',
        component: SuggestionBoxComponent,
        canActivate: [loginGuard],
        canMatch: [ocultarGuard],
        data: { roles: ['admin'] }


    },

    {
        path: 'infraestructura',
        component: InfraestructuraComponent
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },

];
