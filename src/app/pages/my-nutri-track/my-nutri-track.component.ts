import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { MealListComponent } from "../../components/meals/meal-list/meal-list.component";
import { Meal } from '../../interfaces/meals';
import { MealService } from '../../services/meal.service';
import { DatePickerComponent } from "../../components/meals/date-picker/date-picker.component";
import { MealChartComponent } from "../../components/meals/meal-chart/meal-chart.component";

@Component({
  selector: 'app-my-nutri-track',
  standalone: true,
  imports: [MealListComponent, DatePickerComponent,MealChartComponent],
  templateUrl: './my-nutri-track.component.html',
  styleUrl: './my-nutri-track.component.css'
})
export class MyNutriTrackComponent implements OnInit, OnChanges {
  meal: Meal | null = null; // Ahora trabajamos con una sola comida
  @Input() dateRecivedFromDP: string = ''; // Fecha seleccionada o inicial

  constructor(private mealService: MealService) {}

  ngOnInit(): void {
    this.initializeDate(); // Inicializa la fecha antes de cargar la comida
    this.loadMeal(); // Cargar la comida cuando el componente se inicializa
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dateRecivedFromDP']) {
      this.loadMeal(); // Recargar la comida cuando cambia la fecha
    }
  }

  // Método para inicializar la fecha con un valor válido
  private initializeDate(): void {
    const storedDate = localStorage.getItem('loginDate'); // Intenta obtener la fecha guardada
    if (storedDate) {
      this.dateRecivedFromDP = storedDate;
    } else {
      const today = new Date();
      this.dateRecivedFromDP = today.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
    }
    console.log('Fecha inicial:', this.dateRecivedFromDP);
  }

  // Método para cargar la comida correspondiente a la fecha seleccionada
  private loadMeal(): void {
    this.mealService.setCurrentDate(this.dateRecivedFromDP); // Establece la fecha actual en el servicio
    this.mealService.meal$.subscribe((meal) => {
      if (meal) {
        this.meal = meal; // Asignamos la comida recibida al componente
      }
    });
  }

  // Método que se llama cuando se recibe una nueva fecha del DatePicker
  dateRecived(date: string): void {
    console.log('Fecha recibida:', date); // Depuración para ver la fecha recibida
    this.dateRecivedFromDP = date;
    this.loadMeal(); // Recargar la comida al recibir una nueva fecha
  }
}
