import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Food } from '../interfaces/food';
import { Meal, MealType } from '../interfaces/meals';

@Injectable({
  providedIn: 'root'
})
export class MealService {

  private readonly API_URL = 'http://localhost:3000/meals'; // Endpoint de json-server
  private mealSubject = new BehaviorSubject<Meal | null>(null); // Sujeto que almacena una única comida
  meal$ = this.mealSubject.asObservable(); // Observable expuesto para los componentes
  private currentDate: string = ''; // Fecha actual en uso
  private currentUserId: string | null = localStorage.getItem('userToken'); // Obtener el userId del localStorage

  constructor(private http: HttpClient) {}

  // Establecer la fecha actual y cargar la comida correspondiente
  setCurrentDate(date: string): void {
    this.currentDate = date;
    this.loadMeal(); // Cargar la comida para la fecha actual
  }

  // Cargar la comida del usuario para la fecha actual
  private loadMeal(): void {
    console.log(this.currentDate, this.currentUserId);
    if (this.currentUserId && this.currentDate) {
      this.http
        .get<Meal[]>(`${this.API_URL}?idUser=${this.currentUserId}&date=${this.currentDate}`)
        .subscribe((meals) => {
          if (meals.length > 0) {
            this.mealSubject.next(meals[0]);
          } else {
            const emptyMeal = this.createEmptyMeal(this.currentDate, this.currentUserId!);
            this.postMealToBackend(emptyMeal).subscribe((createdMeal) => {
              this.mealSubject.next(createdMeal);
            });
          }
        });
    } else {
      console.log('Faltan datos para cargar la comida: userId o date');
    }
  }

  // Crear una comida vacía para un usuario y una fecha específicos
  private createEmptyMeal(date: string, userId: string): Meal {
    return {
      idUser: userId,
      date: date,
      breakfast: [],
      lunch: [],
      snack: [],
      dinner: [],
      dessert: []
    };
  }

  // Método para agregar un alimento a una comida
  addFoodToMeal(typeMeal: MealType, foods: Food[]): Observable<Meal> {
    const currentMeal = this.mealSubject.getValue(); // Obtener la comida actual
    if (!currentMeal) {
      return throwError('No se encontró una comida para actualizar');
    }
  
    const currentFoods = (currentMeal[typeMeal] as Food[]) || [];
  
    // Iterar sobre los alimentos seleccionados
    foods.forEach(food => {
      // Verificar si el alimento ya existe en la comida
      const existingFoodIndex = currentFoods.findIndex(f => f.id === food.id);
  
      if (existingFoodIndex !== -1) {
        // Si existe, sumamos la cantidad de gramos
        currentFoods[existingFoodIndex].gramQuantity += food.gramQuantity;
      } else {
        // Si no existe, lo agregamos como un nuevo alimento
        currentFoods.push(food);
      }
    });
  
    // Crear una nueva comida con los alimentos actualizados
    const updatedMeal = { ...currentMeal, [typeMeal]: currentFoods };
  
    // Actualizar la comida en el backend
    return this.updateMeal(updatedMeal);
  }
  
  // Método para eliminar un alimento de una comida
  removeFoodFromMeal(meal: Meal, typeMeal: MealType, foodId: string): Observable<Meal> {
    const currentFoods = (meal[typeMeal] as Food[]) || [];
    const updatedFoods = currentFoods.filter((food) => food.id !== foodId);
    const updatedMeal = { ...meal, [typeMeal]: updatedFoods };

    return this.updateMeal(updatedMeal);
  }

  // Método para modificar la cantidad de gramos de un alimento
  updateFoodQuantity(meal: Meal, typeMeal: MealType, foodId: string, newQuantity: number): Observable<Meal> {
    const updatedFoods = (meal[typeMeal] as Food[]).map((food) =>
      food.id === foodId ? { ...food, gramQuantity: newQuantity } : food
    );

    const updatedMeal = { ...meal, [typeMeal]: updatedFoods };

    return this.updateMeal(updatedMeal);
  }

  // Método genérico para actualizar la comida y enviarla al backend
  private updateMeal(updatedMeal: Meal): Observable<Meal> {
    return this.http.put<Meal>(`${this.API_URL}/${updatedMeal.id}`, updatedMeal).pipe(
      map((updated) => {
        console.log('Comida actualizada en backend:', updated);
        this.mealSubject.next(updated);
        return updated;
      }),
      catchError((error) => {
        console.error('Error actualizando la comida:', error);
        return throwError(error);
      })
    );
  }

  // Método para crear la comida en el backend si no existe
  private postMealToBackend(meal: Meal): Observable<Meal> {
    return this.http.post<Meal>(this.API_URL, meal).pipe(
      map((newMeal) => {
        console.log('Comida creada y posteada:', newMeal);
        return newMeal;
      }),
      catchError((error) => {
        console.error('Error creando comida:', error);
        return throwError(error);
      })
    );
  }
}
