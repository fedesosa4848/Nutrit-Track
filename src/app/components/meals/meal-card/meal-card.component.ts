import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal, MealType } from '../../../interfaces/meals';
import { ModalComponent } from '../modal/modal.component';
import { Food } from '../../../interfaces/food';

@Component({
  selector: 'app-meal-card',
  standalone: true,
  imports: [CommonModule, ModalComponent],
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

  selectedTypeMeal: MealType | null = null;

  // Tipos válidos para las comidas
  mealTypes: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner', 'dessert'];

  closeModal() {
    this.selectedTypeMeal = null; // Cerrar modal
  }

  openModal(type: MealType) {
    this.selectedTypeMeal = type; // Abrir modal para el tipo de comida
  }

  // Recibir alimentos seleccionados y agregarlos a la comida
  addFoodsToMeal(foods: Food[]) {
    console.log("ALIMENTOS RECIBIDOS:", JSON.stringify(foods, null, 2));
    if (this.selectedTypeMeal) {
      this.meal[this.selectedTypeMeal].push(...foods);
    }
    this.closeModal();
  }
}
