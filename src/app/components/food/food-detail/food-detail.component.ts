import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Food } from '../../../interfaces/food';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createEmptyFood } from '../../../shared/factories';
import { ActivatedRoute } from '@angular/router';
import { FoodApiService } from '../../../services/food-api.service';
@Component({
  selector: 'app-food-detail',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './food-detail.component.html',
  styleUrl: './food-detail.component.css'
})
export class FoodDetailComponent {
  @Input() foodRecived: Food = {} as Food; // Recibir el alimento desde el componente contenedor
  @Input() addMode: boolean = false; // Nuevo input para controlar el modo de edición
  @Input() customGrams: number = 0; // Gramos personalizados si estamos en addMode
  gramQuantity: number = 100;

  constructor(private route: ActivatedRoute, private _foodApi: FoodApiService) { }

  get effectiveGrams(): number {
    return this.addMode ? this.customGrams : this.gramQuantity;
  }
} 
