import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MealsService } from '../../../services/meals.service';

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
    private _myMealsService: MealsService) {
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
          this.router.navigate(['/userProfile']); // Redirigir a la página protegida
          this._myMealsService.loadMeals(userToken).subscribe()
        } else {
          this.loginFailed = true; // Mostrar mensaje de error
        }
      });
    }
  }
}
