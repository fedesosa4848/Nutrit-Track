import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Food } from '../../../interfaces/food';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { createEmptyFood } from '../../../shared/factories';
import { FoodDetailComponent } from '../food-detail/food-detail.component';
@Component({
  selector: 'app-food-container',
  standalone: true,
  imports: [CommonModule, FormsModule, CommonModule, FoodDetailComponent],
  templateUrl: './food-container.component.html',
  styleUrl: './food-container.component.css'
})
export class FoodContainerComponent {
  // Se inicializa una variable de food en vacío, este input recibirá un food a renderizar
  @Input() foodRecived: Food = createEmptyFood();
  // Se crea un output que emitirá el alimento del container (que tiene la funcionalidad de un card) al componente detail
  @Output() foodEmitter = new EventEmitter(); // Emisor de evento cuando se hace click en una comida

  @Input() addMode: boolean = false; // Nuevo input para activar el modo de añadir

  @Input() customGrams: number = 0;
  @Output() selectionChanged = new EventEmitter<Food | null>(); // Evento para emitir cambios en la selección, permitiendo null

  isDetailVisible = false; // Nueva variable para controlar la visibilidad de los detalles
  isChecked: boolean = false; // Estado del checkbox para este alimento

  emitFoodClick() {
    this.foodEmitter.emit(this.foodRecived);
  }

  toggleDetails() {
    this.isDetailVisible = !this.isDetailVisible;  // Cambiar el estado de visibilidad de los detalles
  }

  // Cambia el estado del checkbox y emite el alimento si está seleccionado
  toggleSelection() {
    // this.isChecked = !this.isChecked; // Cambia el estado del checkbox
    console.log("Checkbox estado:", this.isChecked);  // Verifica si el estado del checkbox cambia

    if (this.isChecked) {
      // Configura el alimento con la cantidad personalizada de gramos
      const foodWithCustomGrams = {
        ...this.foodRecived,
        gramQuantity: this.customGrams || 100,
      };
      this.selectionChanged.emit(foodWithCustomGrams); // Emite el alimento seleccionado
    } else {
      this.selectionChanged.emit(null); // Emite `null` si se desmarca
    }
  }
}
