import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MealService } from '../../../services/meal.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loginFailed: boolean = false; //  propiedad para mostrar el error

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _myMealsService: MealService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(success => {
        if (success) {
          const userToken = localStorage.getItem('userToken')
          const loginDate = localStorage.getItem('loginDate');
          this.router.navigate(['/userProfile']); // Redirigir a la página protegida
          // if(userToken && loginDate)this._myMealsService.getMealsByUserId(userToken,loginDate).subscribe()
        } else {
          this.loginFailed = true; // Mostrar mensaje de error
        }
      });
    }
  }
}
