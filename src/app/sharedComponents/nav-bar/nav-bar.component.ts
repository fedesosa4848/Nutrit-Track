import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  isLoggedIn: boolean = false;
  accountMenuVisible = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // Subscribirse al estado de autenticación para actualizar `isLoggedIn`
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
    });
  }


  navigateToHome() {
    this.router.navigate(['']);
  }


  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout(); // Llama al método de logout del servicio de autenticación
    this.router.navigate(['']).then(() => {
      window.location.reload(); // Recarga la página una vez que la navegación se complete
    });
  }


  navigateToUserProfile() {
    this.router.navigate(['/userProfile']);
  }

  navigateToNutriTrack(){
    this.router.navigate(['/my-Nutri-Track']);
  }

  toggleAccountMenu() {
    this.accountMenuVisible = !this.accountMenuVisible;
    console.log('Account menu visible:', this.accountMenuVisible); // Para depuración
  }

  navigateToRecipes(){
    this.router.navigate(['recetas']);
  }

  navigateToFoods(){
    this.router.navigate(['alimentos']);
  }


}
