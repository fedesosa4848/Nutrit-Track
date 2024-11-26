import { Routes } from '@angular/router';
import { AlimentosComponent } from './pages/alimentos/alimentos.component';
import { LandingComponent } from './pages/landing/landing.component';
import { RecetasComponent } from './pages/recetas/recetas.component';
import { RegisterFormComponent } from './pages/register-form/register-form.component';
import { UserProfilePageComponent } from './pages/user/user-profile-page/user-profile-page.component';
import { LoginComponent } from './components/user/login/login.component';
import { MyNutriTrackComponent } from './pages/my-nutri-track/my-nutri-track.component';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';
import { FaqComponent } from './pages/faq/faq.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { authGuard } from './auth.guard';
import { FoodDetailComponent } from './components/food/food-detail/food-detail.component';

export const routes: Routes = [
    { path: 'alimentos', component: AlimentosComponent },
    { path: 'inicio', component: LandingComponent },
    { path: 'recetas', component: RecetasComponent },
    { path: 'register', component: RegisterFormComponent },
    { path: 'food-detail/:id', component: FoodDetailComponent },
    { path: 'userProfile',
         component: UserProfilePageComponent ,
        canActivate:[authGuard] },
    { path: 'my-Nutri-Track', component: MyNutriTrackComponent,canActivate:[authGuard] },
    { path: 'faq', component: FaqComponent},
    { path:'about',component: AboutComponent},
    { path:'contact',component: ContactComponent},
    {
        path: 'login',
        component: LoginComponent, // Ruta pública para el login
    },
    {
         path: 'edit/:id', component: UserEditComponent ,canActivate:[authGuard]
    },
    {path: 'access-Denied', component:AccessDeniedComponent},
    { path: '', component: LandingComponent },
    {path: '**', redirectTo:''}
];
