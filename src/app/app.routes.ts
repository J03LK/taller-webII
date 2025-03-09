import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { DenunciasComponent } from './components/tablaDenuncias/denuncias.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { InfraestructuraComponent } from './pages/infraestructura/infraestructura.component';



export const routes: Routes = [
    {
        path:'home',
        component:HomeComponent
    },
    
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'denuncias',
        component:DashboardComponent
    },
    {
        path:'nosotros',
        component:NosotrosComponent
    },
    {
        path:'tabla-denuncias',
        component:DenunciasComponent
    },
    {
        path:'infraestructura',
        component:InfraestructuraComponent
    },
    {
        path:'',
        redirectTo:'/home',
        pathMatch:'full'
    },

];
