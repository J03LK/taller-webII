import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
<<<<<<< HEAD
import { DenunciasComponent } from './components/tablaDenuncias/denuncias.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { InfraestructuraComponent } from './pages/infraestructura/infraestructura.component';
=======
import { loginGuard } from './guards/login.guard';

>>>>>>> f8f28bd33026cc9cdf868ca3385751ec0f6a6dc9



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
<<<<<<< HEAD

=======
    
    {path:'denuncias',
        component:DashboardComponent,
        canActivate:[loginGuard]
        
    },
    {
        path:'login',
        component:LoginComponent
    }
    
    
>>>>>>> f8f28bd33026cc9cdf868ca3385751ec0f6a6dc9
];
