import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal, MealType } from '../../../interfaces/meals';
import { ModalComponent } from '../modal/modal.component';
import { Food } from '../../../interfaces/food';
import { MealService } from '../../../services/meal.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-meal-card',
  standalone: true,
  imports: [CommonModule, ModalComponent,FormsModule],
  templateUrl: './meal-card.component.html',
  styleUrls: ['./meal-card.component.css']
})
export class MealCardComponent implements OnInit {
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
  mealTypes: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner', 'dessert'];

  editingFoodId: string | null = null; // ID del alimento que se está editando
  newGramQuantity: number = 0; // Cantidad de gramos nueva

  constructor(private mealService: MealService) {}

  ngOnInit() {
    console.log('Comida recibida en el componente:', this.meal);
  }

  closeModal() {
    this.selectedTypeMeal = null; // Cerrar modal
  }

  openModal(type: MealType) {
    this.selectedTypeMeal = type; // Abrir modal para el tipo de comida
    console.log('Modal abierto con tipo de comida:', this.selectedTypeMeal);
  }

  removeFood(typeMeal: MealType, foodId: string) {
    this.mealService.removeFoodFromMeal(this.meal, typeMeal, foodId).subscribe(
      (updatedMeal) => {
        console.log('Alimento eliminado:', foodId);
        this.meal = updatedMeal; // Actualizar la comida en la interfaz
      }
    );
  }

  // Comenzar a editar un alimento
  startEditingFood(typeMeal: MealType, foodId: string) {
    const food = this.getFoodById(typeMeal, foodId);
    if (food) {
      this.editingFoodId = foodId;
      this.newGramQuantity = food.gramQuantity;
    }
  }

  // Cancelar la edición
  cancelEditing() {
    this.editingFoodId = null;
  }

  // Actualizar la cantidad de gramos
  updateFoodQuantity(typeMeal: MealType, foodId: string) {
    if (this.newGramQuantity < 10 || this.newGramQuantity > 1000) {
      alert('La cantidad debe estar entre 10 y 1000 gramos.');
      return;
    }

    this.mealService.updateFoodQuantity(this.meal, typeMeal, foodId, this.newGramQuantity).subscribe(
      (updatedMeal) => {
        console.log('Cantidad actualizada para el alimento:', foodId);
        this.meal = updatedMeal; // Actualizar la comida en la interfaz
        this.cancelEditing(); // Salir del modo edición
      }
    );
  }

  // Obtener un alimento por su ID
  private getFoodById(typeMeal: MealType, foodId: string): Food | undefined {
    return this.meal[typeMeal].find((food) => food.id === foodId);
  }
}
