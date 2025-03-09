import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { loginGuard } from './guards/login.guard';




export const routes: Routes = [
    {
        path:'home',
        component:HomeComponent
    },
    {
        path:'',
        redirectTo:'/home',
        pathMatch:'full'
    },
    
    {path:'denuncias',
        component:DashboardComponent,
        canActivate:[loginGuard]
        
    },
    {
        path:'login',
        component:LoginComponent
    }
    
    
];
