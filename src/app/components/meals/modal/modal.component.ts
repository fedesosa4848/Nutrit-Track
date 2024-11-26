import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BarraBuscadoraComidasComponent } from "../../barra-buscadora-comidas/barra-buscadora-comidas.component";
import { Food } from '../../../interfaces/food';
import { FoodApiService } from '../../../services/food-api.service';
import { FoodContainerComponent } from "../../food/food-container/food-container.component";
import { createEmptyFood } from '../../../shared/factories';
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, BarraBuscadoraComidasComponent, FoodContainerComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() mealId!: string;
  @Input() typeMeal!: string;
  @Output() foodsSelected = new EventEmitter<Food[]>(); // Lista de alimentos seleccionados
  @Output() modalClosed = new EventEmitter<void>();




  searchQuery: string = ''; // Búsqueda
  arrayFoods: Food[] = []; // Resultados de la búsqueda
  selectedFoods: Food[] = []; // Lista de alimentos seleccionados
 

  constructor(private _foodApi:FoodApiService){}

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

  addFoods() {
    this.foodsSelected.emit(this.selectedFoods); // Emitir la lista seleccionada
    this.closeModal();
  }

  closeModal() {
    this.modalClosed.emit();
  }
}
