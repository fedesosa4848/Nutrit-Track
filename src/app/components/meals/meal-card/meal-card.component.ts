import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Food } from '../../../interfaces/food';
import { FoodContainerComponent } from '../../food-container/food-container.component';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createEmptyFood } from '../../../shared/factories';
import { Meal } from '../../../interfaces/meals';

@Component({
  selector: 'app-meal-card',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './meal-card.component.html',
  styleUrl: './meal-card.component.css'
})
export class MealCardComponent  {
  @Input() meal: Meal | undefined; // Recibimos la comida a mostrar

  mealCategories = [
    { key: 'breakfast', label: 'Desayuno' },
    { key: 'lunch', label: 'Almuerzo' },
    { key: 'snack', label: 'Merienda' },
    { key: 'dinner', label: 'Cena' },
    { key: 'dessert', label: 'Postre' }
  ];
  

}
