import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user';
import * as nutritionUtils from '../../../utils/nutrtion.utils';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  editForm: FormGroup;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      firstName: ['', Validators.required],  // Changed from 'name' to 'firstName'
      lastName: ['', Validators.required],   // Changed from 'surname' to 'lastName'
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(10)]],
      weight: [null, [Validators.required, Validators.min(40)]],
      height: [null, [Validators.required, Validators.min(100)]],
      gender: ['', Validators.required],
      goal: ['', Validators.required],  // Added 'goal'
      activityLevel: ['', Validators.required],  // Added 'activityLevel'
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      // Get the user ID from the URL
      this.userId = paramMap.get('id');
      if (this.userId) {
        // Fetch user data by ID from the service
        this.userService.getUserById(this.userId).subscribe({
          next: (userData: User) => {
            // Load user data into the form
            this.editForm.patchValue(userData.profile); // Ensure to patch the 'profile' data
          },
          error: (error) => {
            console.error('Error fetching user data:', error);
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) return;

    const confirmUpdate = confirm("Are you sure you want to update your data?");
    if (confirmUpdate) {
      const updatedUser: User = this.editForm.getRawValue();
      
      // Calculate the necessary calories (TDEE or BMR, depending on your system)
      const bmr = nutritionUtils.calculateBMR(updatedUser);
      const tdee = nutritionUtils.calculateTDEE(updatedUser);
      const calorieGoal = nutritionUtils.calculateCalorieGoal(updatedUser);
      
      updatedUser.nutritionalData = {
        bmr: bmr,
        tdee: tdee,
        calorieGoal: calorieGoal,
        macronutrients: {
          proteins: 0, // You can update this as per user input
          carbohydrates: 0, // Update as needed
          fats: 0, // Update as needed
        }
      };

      // Update the user via the service
      this.userService.modifyUser(this.userId!, updatedUser).subscribe({
        next: () => {
          alert('Profile updated successfully');
          this.router.navigate(['/userProfile']);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          alert('Error updating profile');
        }
      });
    }
  }
}
