import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal, MealType } from '../../../interfaces/meals';
import { ModalComponent } from '../modal/modal.component';
import { Food } from '../../../interfaces/food';
import { MealService } from '../../../services/meal.service';

@Component({
  selector: 'app-meal-card',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './meal-card.component.html',
  styleUrl: './meal-card.component.css'
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

  // Tipos válidos para las comidas
  mealTypes: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner', 'dessert'];

  constructor( private mealService:MealService){}

  ngOnInit() {
    // Log para verificar el valor de meal al iniciar el componente
    console.log('Comida recibida en el componente:', this.meal);
  }

  closeModal() {
    this.selectedTypeMeal = null; // Cerrar modal
  }

  openModal(type: MealType) {
    this.selectedTypeMeal = type; // Abrir modal para el tipo de comida
  }

  // Recibir alimentos seleccionados y agregarlos a la comida
  addFoodsToMeal(foods: Food[]) {
    console.log("Función addFoodsToMeal llamada con los alimentos:", foods);
    console.log("Comida a la que se agregarán los alimentos:", this.meal);
    if (this.selectedTypeMeal && this.meal.id) {
      this.mealService.addFoodToMeal(this.meal.id, this.selectedTypeMeal, foods).subscribe({
        next: (updatedMeal) => {
          console.log("Comida actualizada con los alimentos:", updatedMeal);
          this.meal = updatedMeal;  // Actualiza la comida con la respuesta del backend
          this.closeModal(); // Cierra el modal después de agregar los alimentos
        },
        error: (err) => console.error('Error al agregar alimentos:', err)
      });
    } else {
      console.error('ID de comida o tipo de comida no definido');
    }
  }
  
}
