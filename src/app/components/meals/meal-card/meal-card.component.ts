import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Food } from '../../../interfaces/food';
import { FoodContainerComponent } from '../../food-container/food-container.component';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createEmptyFood } from '../../../shared/factories';

@Component({
  selector: 'app-meal-card',
  standalone: true,
  imports: [FoodContainerComponent, CommonModule, FormsModule],
  templateUrl: './meal-card.component.html',
  styleUrl: './meal-card.component.css'
})
export class MealCardComponent implements OnChanges {
  @Input() arrayFood?: Food[] = []; //array de comidas que renderiza
  @Output() deleteEmmiter = new EventEmitter(); //envia el evento del delete para meal list
  @Output() modifyEmitter = new EventEmitter(); //envia el evento de update para meal list
  @Input() mealType?: 'breakfast' | 'lunch' | 'snack' | 'dinner'; //recibe el mealtype
  @Output() mealTypeEmitter = new EventEmitter(); //envia el mealType a meal list
  @Output() addModeEmmiter = new EventEmitter(); //envia el addMode event a meal list

  totalCalories: number = 0;
  isExpanded = false;
  editMode = false;
  newGramQuantity = 0; //variable de la cantidad de gramos cuando lo modificas
  foodToModified: Food = createEmptyFood(); //variable de la food modificada que hay que emitir

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateCalories();
  }

  emitDelete(food: Food) {
    
    this.deleteEmmiter.emit(food);
  }

  emitMealType() {
    this.mealTypeEmitter.emit(this.mealType);
  }

  emitAddMode() {
    
    this.addModeEmmiter.emit();
  }

  emitFoodModified() {
    this.foodToModified.gramQuantity = this.newGramQuantity;
    this.modifyEmitter.emit(this.foodToModified);
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  calculateCalories() {
    this.totalCalories = 0;
    if (this.arrayFood) {
      for (let food of this.arrayFood) {
        this.totalCalories += food.caloriesPerGram * food.gramQuantity;
      }
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  saveFoodToUpdate(food: Food) {
    this.foodToModified = food;
  }

}
