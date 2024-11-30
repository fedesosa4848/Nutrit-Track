import { Component, Input, OnInit } from '@angular/core';
import { MealCardComponent } from "../meal-card/meal-card.component";
import { Meal } from '../../../interfaces/meals';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meal-list',
  standalone: true,
  imports: [MealCardComponent, CommonModule],
  templateUrl: './meal-list.component.html',
  styleUrl: './meal-list.component.css'
})
export class MealListComponent implements OnInit {
  @Input() meal: Meal | null = null; // Ahora recibimos una única comida

  ngOnInit(): void {
    if (this.meal) {
      console.log("Vas a trabajar con esta comida:", this.meal);
    } else {
      console.log("No hay comida disponible para mostrar.");
    }
  }
}
