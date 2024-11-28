import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { MealListComponent } from "../../components/meals/meal-list/meal-list.component";
import { Meal } from '../../interfaces/meals';
import { MealService } from '../../services/meal.service';
import { DatePickerComponent } from "../../components/meals/date-picker/date-picker.component";
import { createEmptyMeal } from '../../shared/factories';
@Component({
  selector: 'app-my-nutri-track',
  standalone: true,
  imports: [MealListComponent, DatePickerComponent],
  templateUrl: './my-nutri-track.component.html',
  styleUrl: './my-nutri-track.component.css'
})
export class MyNutriTrackComponent implements OnInit, OnChanges {
  meals: Meal[] = [];
  comidas:Meal[] = [];
  @Input()
  dateRecivedFromDP: string = ''; // Fecha seleccionada o inicial

  constructor(private mealService: MealService) {}

  ngOnInit(): void {
   
    this.initializeDate(); // Inicializa la fecha antes de cargar las comidas
    this.loadMeals(); // Cargar las comidas cuando el componente se inicializa
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si hay cambios en la fecha (por ejemplo, si el usuario seleccionó otra fecha), recargamos
    if (changes['dateRecivedFromDP']) {
      this.loadMeals();
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
    console.log('Fecha inicial:', this.dateRecivedFromDP); // Depuración
  }

  loadMeals(): void {
    const userId = localStorage.getItem('userToken');
    if (userId && this.dateRecivedFromDP) {
      this.mealService.getMealsByUserId(userId, this.dateRecivedFromDP).subscribe((meals) => {
        if (meals.length === 0) {
          // Si no hay comidas para la fecha, creamos una vacía y la guardamos
          const emptyMeal = this.mealService.createEmptyMeal(this.dateRecivedFromDP, userId);
          this.mealService.postMealToBackend(emptyMeal).subscribe((createdMeal) => {
            // Después de que la comida vacía se guarda en el backend, la agregamos al array local
            this.meals = [createdMeal];
          });
        } else {
          this.meals = meals;
        }
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
