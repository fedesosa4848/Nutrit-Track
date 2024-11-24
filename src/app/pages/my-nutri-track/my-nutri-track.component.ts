import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { MealListComponent } from "../../components/meals/meal-list/meal-list.component";
import { Meal } from '../../interfaces/meals';
import { MealService } from '../../services/meal.service';
import { DatePickerComponent } from "../../components/meals/date-picker/date-picker.component";

@Component({
  selector: 'app-my-nutri-track',
  standalone: true,
  imports: [MealListComponent, DatePickerComponent],
  templateUrl: './my-nutri-track.component.html',
  styleUrl: './my-nutri-track.component.css'
})
export class MyNutriTrackComponent implements OnInit, OnChanges {
  meals: Meal[] = [];
  
  @Input()
  dateRecivedFromDP: string = ''; // Date que recibimos del DatePicker (DP)

  constructor(private mealService: MealService) {}

  ngOnInit(): void {
    this.loadMeals(); // Cargar las comidas cuando el componente se inicializa
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si hay cambios en la fecha (por ejemplo, si el usuario seleccionó otra fecha), recargamos
    if (changes['dateRecivedFromDP']) {
      this.loadMeals();
    }
  }

  // Método para cargar las comidas del usuario, filtrando por fecha
  loadMeals(): void {
    const userId = localStorage.getItem('userToken');
    if (userId && this.dateRecivedFromDP) {
      // Llamamos al servicio para obtener las comidas filtradas por usuario y fecha
      this.mealService.getMealsByUserId(userId, this.dateRecivedFromDP).subscribe((meals) => {
        this.meals = meals; // Guardamos las comidas filtradas en el estado del componente
        console.log('Comidas filtradas por fecha:', meals); // Depuración para ver las comidas filtradas
      });
    } else {
      console.log('Faltan datos para cargar las comidas: userId o date');
    }
  }

  // Método que se llama cuando se recibe una nueva fecha del DatePicker
  dateRecived(date: string): void {
    console.log('Fecha recibida:', date); // Depuración para ver la fecha recibida
    this.dateRecivedFromDP = date;
    this.loadMeals(); // Recargar las comidas al recibir una nueva fecha
  }
}
