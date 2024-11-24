import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Food } from '../../interfaces/food';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { createEmptyFood } from '../../shared/factories';
import { FoodDetailComponent } from '../food-detail/food-detail.component';

@Component({
  selector: 'app-food-container',
  standalone: true,
  imports: [CommonModule, FormsModule, CommonModule,FoodDetailComponent],
  templateUrl: './food-container.component.html',
  styleUrl: './food-container.component.css'
})
export class FoodContainerComponent {
   //Se inicializa una variable de food en vacio , este input recibira un food a renderizar
  @Input() foodRecived: Food = createEmptyFood();
  //Se crea un output que emitira el alimento del container ( que tiene la funcionalidad de un card) al componente detail
  @Output() foodEmitter = new EventEmitter(); //emisor de evento cuando se hace click en una comida

  isDetailVisible = false;  // Nueva variable para controlar la visibilidad de los detalles

  emitFoodClick() {
    this.foodEmitter.emit(this.foodRecived);
  }

  toggleDetails() {
    this.isDetailVisible = !this.isDetailVisible;  // Cambiar el estado de visibilidad de los detalles
  }
  
}
