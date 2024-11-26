import { Component, Input, OnInit } from '@angular/core';
import { MealCardComponent } from "../meal-card/meal-card.component";
import { Meal } from '../../../interfaces/meals';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meal-list',
  standalone: true,
  imports: [MealCardComponent,CommonModule],
  templateUrl: './meal-list.component.html',
  styleUrl: './meal-list.component.css'
})
export class MealListComponent implements OnInit {
  @Input() meals: Meal[] = []; // Recibimos las comidas desde el componente principal

  ngOnInit(): void {
      console.log("vas a trabajar con esta comdia: "+ this.meals)
  }

}
