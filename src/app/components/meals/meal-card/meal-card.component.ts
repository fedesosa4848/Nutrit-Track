import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meal, MealType } from '../../../interfaces/meals';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-meal-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './meal-card.component.html',
  styleUrl: './meal-card.component.css'
})
export class MealCardComponent {
  @Input() meal: Meal = {
    id: '',
    idUser: '',
    date: '',
    breakfast: [],
    lunch: [],
    snack: [],
    dinner: [],
    dessert: []
  };

  @Output() foodAdded = new EventEmitter<void>();

  selectedTypeMeal: MealType | null = null;

  // Tipos válidos para las comidas
  mealTypes: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner', 'dessert'];

  closeModal() {
    this.selectedTypeMeal = null;
  }

  onFoodAdded(food: { food: string; gramQuantity: number }) {
    console.log('Food added:', food);
    // Aquí puedes llamar a `this.mealService` para actualizar la comida en el backend
  }

  openModal(type: MealType) {
    this.selectedTypeMeal = type;
  }
}
