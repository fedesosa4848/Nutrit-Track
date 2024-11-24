import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user';
import * as NutritionUtils from '../../../utils/nutrtion.utils';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required], // nombre → firstName
      lastName: ['', Validators.required], // apellido → lastName
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(10)]], // edad → age
      weight: [null, [Validators.required, Validators.min(40)]], // peso → weight
      height: [null, [Validators.required, Validators.min(100)]], // altura → height
      gender: ['', Validators.required], // genero → gender
      goal: ['', Validators.required], // perfil → goal
      activityLevel: ['', Validators.required], // nivelActividad → activityLevel
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const dataUser = this.registerForm.getRawValue();

      const newUser: User = {
        profile: dataUser,
        nutritionalData: {
          bmr: 0, // tmb → bmr
          tdee: 0,
          calorieGoal: 0, // caloriasObjetivo → calorieGoal
          macronutrients: {
            proteins: 0, // proteinas → proteins
            carbohydrates: 0, // carbohidratos → carbohydrates
            fats: 0, // grasas → fats
          },
        },
      };

      // Calculate nutritional values
      newUser.nutritionalData.bmr = NutritionUtils.calculateBMR(newUser);
      newUser.nutritionalData.tdee = NutritionUtils.calculateTDEE(newUser);
      newUser.nutritionalData.calorieGoal = NutritionUtils.calculateCalorieGoal(newUser);
      newUser.nutritionalData.macronutrients = NutritionUtils.calculateMacronutrients(newUser);

      // Register the user via the service
      this.userService.addUser(newUser).subscribe({
        next: () => {
          this.router.navigate(['/userProfile']); // Redirect to the user profile
        },
        error: (error) => {
          console.error('Error registering user:', error);
        },
      });
    }
  }

  togglePassword() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }
}
