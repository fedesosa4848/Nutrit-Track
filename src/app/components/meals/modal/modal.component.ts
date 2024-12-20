import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BarraBuscadoraComidasComponent } from "../../barra-buscadora-comidas/barra-buscadora-comidas.component";
import { Food } from '../../../interfaces/food';
import { FoodApiService } from '../../../services/food-api.service';
import { FoodContainerComponent } from "../../food/food-container/food-container.component";
import { Meal,MealType } from '../../../interfaces/meals';
import { MealService } from '../../../services/meal.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, BarraBuscadoraComidasComponent, FoodContainerComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit {
  @Input() mealId!: string;
  @Input() typeMeal!: string;
  @Output() modalClosed = new EventEmitter<void>();

  @Input() comida: Meal | null = null;

  searchQuery: string = ''; // Búsqueda
  arrayFoods: Food[] = []; // Resultados de la búsqueda
  selectedFoods: Food[] = []; // Lista de alimentos seleccionados

  constructor(private _foodApi: FoodApiService, private mealService: MealService) {}

  ngOnInit(): void {
    console.log("tipo de comida emitida desde el card : " + this.typeMeal);
    console.log("VAS A TENER QUE AGREGAR ALIMENTOS A ESTE REGISTRO: " + this.comida?.id);
  }

  // Método para buscar alimentos
  searchFoodByName(foodName: string): void {
    this._foodApi.searchFoodByName(foodName).subscribe({
      next: (foods) => {
        this.arrayFoods = foods;
        console.log('Lista de alimentos recibida:', this.arrayFoods);
      },
      error: (err) => {
        console.error('Error al buscar alimentos:', err);
      },
    });
  }

  // Agregar o quitar alimentos seleccionados
  handleSelection(food: Food | null) {
    if (food) {
      this.selectedFoods.push(food); // Agregar si está seleccionado
    } else {
      // Quitar si se desmarca
      this.selectedFoods = this.selectedFoods.filter((f) => f !== food);
    }
  }

  

  addFoodsToMeal() {
    if (this.typeMeal && this.comida?.id) {
      this.mealService.addFoodToMeal(this.typeMeal  as MealType, this.selectedFoods).subscribe({
        next: (updatedMeal: Meal) => {
          console.log("Comida actualizada con los alimentos:", updatedMeal);
          this.comida = updatedMeal; // Actualiza la comida con la respuesta del backend
          this.closeModal(); // Cierra el modal después de agregar los alimentos
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al agregar alimentos:', err.message);
        }
      });
    } else {
      console.error('ID de comida o tipo de comida no definido');
    }
  }
  

  closeModal() {
    this.modalClosed.emit();
  }
}
