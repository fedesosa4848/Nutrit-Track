import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Food } from '../interfaces/food';
import { Meal ,MealType} from '../interfaces/meals';
import { map ,switchMap} from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MealService {
  private readonly API_URL = 'http://localhost:3000/meals'; // Endpoint de json-server
  private mealsSubject = new BehaviorSubject<Meal[]>([]); // Sujeta el estado de las comidas
  private meals$ = this.mealsSubject.asObservable(); // Exponemos el observable para que los componentes puedan suscribirse

  constructor(private http: HttpClient) {
    this.loadMeals(); // Cargar las comidas al inicializar el servicio
  }

  



  // Cargar las comidas del usuario desde el backend
  private loadMeals(): void {
    const userId = localStorage.getItem('userId'); // Obtener el idUser del localStorage
    if (userId) {
      this.http.get<Meal[]>(`${this.API_URL}?idUser=${userId}`).subscribe((meals) => {
        console.log('Comidas cargadas desde el backend:'+ meals); // Verificar comidas cargadas

        this.mealsSubject.next(meals); // Actualizamos el estado de las comidas
      });
    }
  }

     // Obtener comidas por ID de usuario y fecha
  getMealsByUserId(userId: string, date: string): Observable<Meal[]> {
    console.log('Fetching meals for userId:', userId); // Depuración para ver el userId
    return this.http.get<Meal[]>(`${this.API_URL}?idUser=${userId}`).pipe(
      switchMap((meals) => {
        this.mealsSubject.next(meals); // Actualizar el estado local

        console.log('Meals fetched:', meals); // Depuración para ver las comidas obtenidas
        return this.getMealsByDate(date, meals);
      })
    );
  }

  // Buscar comidas por fecha
  getMealsByDate(date: string, meals: Meal[]): Observable<Meal[]> {
    console.log('Filtering meals for date:', date); // Depuración para ver la fecha
    return new Observable((observer) => {
      const filteredMeals = meals.filter((meal) => meal.date === date);
      console.log('Filtered meals:', filteredMeals); // Depuración para ver las comidas filtradas
      observer.next(filteredMeals);
      observer.complete();
    });
  }
  
  // Agregar un alimento a una comida
  addFoodToMeal(mealId: string | undefined, typeMeal: string, foods: Food[]): Observable<Meal> {
  console.log('ID de comida:', mealId);
  console.log('Tipo de comida:', typeMeal);
  console.log('Alimentos a agregar:', foods);

  // Obtener las comidas actuales desde el BehaviorSubject
  const currentMeals = this.mealsSubject.getValue();
  console.log('Comidas actuales:', currentMeals);

  // Buscar la comida a actualizar
  const mealToUpdate = currentMeals.find((meal) => meal.id === mealId);

  if (!mealToUpdate) {
    console.error('Comida no encontrada');
    return throwError(() => new Error('Meal not found'));
  }

  console.log('Comida encontrada:', mealToUpdate);

  // Actualizar la comida con los nuevos alimentos
  return this.updateMealWithFood(mealToUpdate, typeMeal, foods);
}
  
private updateMealWithFood(meal: Meal, typeMeal: string, foods: Food[]): Observable<Meal> {
  const currentFoods = (meal[typeMeal as keyof Meal] as Food[]) || [];

  // Actualizar alimentos sumando los gramos si ya existe
  const updatedFoods = foods.map((newFood) => {
    const existingFoodIndex = currentFoods.findIndex((currentFood: Food) => currentFood.id === newFood.id);

    if (existingFoodIndex !== -1) {
      // Si ya existe, sumamos la cantidad de gramos
      currentFoods[existingFoodIndex].gramQuantity += newFood.gramQuantity;
      return null; // No necesitamos agregar este alimento de nuevo
    } else {
      // Si no existe, lo agregamos como nuevo
      return newFood;
    }
  }).filter((food): food is Food => food !== null); // Filtramos los `null` y aseguramos el tipo

  const finalFoods = [...currentFoods, ...updatedFoods];

  const updatedMeal: Meal = {
    ...meal,
    [typeMeal]: finalFoods
  };

  // Enviar la actualización al backend
  return this.http.put<Meal>(`${this.API_URL}/${meal.id}`, updatedMeal).pipe(
    map((updated) => {
      console.log('Comida actualizada en backend:', updated);

      // Actualizar la comida en el BehaviorSubject
      const currentMeals = this.mealsSubject.getValue();
      const updatedMeals = currentMeals.map((m) => (m.id === updated.id ? updated : m));
      this.mealsSubject.next(updatedMeals); // Actualiza el estado local

      return updated;
    })
  );
}






createEmptyMeal(date: string, userId: string): Meal {
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


  // Método para agregar una comida al backend (si aún no existe)
  postMealToBackend(meal: Meal): Observable<Meal> {
    return this.http.post<Meal>(this.API_URL, meal).pipe(
      map((newMeal) => {
        const updatedMeals = [...this.mealsSubject.value, newMeal];
        this.mealsSubject.next(updatedMeals); // Actualizamos el estado local
        return newMeal;
      })
    );
  }
  
  

  // Eliminar un alimento de una comida
  removeFoodFromMeal(meal: Meal, typeMeal: string, foodId: string): Observable<Meal> {
    const currentFoods = (meal[typeMeal as keyof Meal] as Food[]) || [];
  
    // Filtrar los alimentos dejando fuera el que queremos eliminar
    const updatedFoods = currentFoods.filter((food: Food) => food.id !== foodId);
  
    // Crear una copia actualizada de la comida con la nueva lista de alimentos
    const updatedMeal: Meal = {
      ...meal,
      [typeMeal]: updatedFoods
    };
  
    // Enviar la actualización al backend
    return this.http.put<Meal>(`${this.API_URL}/${meal.id}`, updatedMeal).pipe(
      map((updated) => {
        console.log('Alimento eliminado y comida actualizada en backend:', updated);
  
        // Actualizar la comida en el BehaviorSubject
        const currentMeals = this.mealsSubject.getValue();
        const updatedMeals = currentMeals.map((m) => (m.id === updated.id ? updated : m));
        this.mealsSubject.next(updatedMeals); // Actualiza el estado local
  
        return updated;
      })
    );
  }
  
  
  

  // Modificar la cantidad de gramos de un alimento en una comida
  updateFoodQuantity(meal: Meal, typeMeal: MealType, foodId: string, newQuantity: number): Observable<Meal> {
    const updatedFoods = (meal[typeMeal as keyof Meal] as Food[]).map(food => {
      if (food.id === foodId) {
        console.log('Actualizando cantidad de gramos:', { foodId, newQuantity }); // Log antes de actualizar

        return { ...food, gramQuantity: newQuantity };
      }
      return food;
    });
  
    const updatedMeal: Meal = {
      ...meal,
      [typeMeal]: updatedFoods
    };

    console.log('Enviando solicitud PUT al backend:', updatedMeal);

  
    // Enviar la actualización al backend
    return this.http.put<Meal>(`${this.API_URL}/${meal.id}`, updatedMeal).pipe(
      map((updated) => {
        console.log('Comida actualizada en backend:', updated);
        return updated;
      })
    );
  }
  

}
