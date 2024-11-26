import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Food } from '../interfaces/food';
import { Meal } from '../interfaces/meals';
import { map ,switchMap} from 'rxjs';
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



  // Cargar las comidas del usuario desde el backend
  private loadMeals(): void {
    const userId = localStorage.getItem('userId'); // Obtener el idUser del localStorage
    if (userId) {
      this.http.get<Meal[]>(`${this.API_URL}?idUser=${userId}`).subscribe((meals) => {
        this.mealsSubject.next(meals); // Actualizamos el estado de las comidas
      });
    }
  }

     // Obtener comidas por ID de usuario y fecha
  getMealsByUserId(userId: string, date: string): Observable<Meal[]> {
    console.log('Fetching meals for userId:', userId); // Depuración para ver el userId
    return this.http.get<Meal[]>(`${this.API_URL}?idUser=${userId}`).pipe(
      switchMap((meals) => {
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
    console.log('ID de comida:', mealId); // Depuración para ver el ID de la comida
    console.log('Tipo de comida:', typeMeal); // Depuración para ver el tipo de comida (desayuno, almuerzo, etc.)
    console.log('Alimentos a agregar:', foods); // Depuración para ver los alimentos que estamos recibiendo
  
    const currentMeals = this.mealsSubject.value;
    let mealToUpdate = currentMeals.find((meal) => meal.id === mealId);
  
    if (!mealToUpdate) {
      console.error('Comida no encontrada');
      throw new Error('Meal not found');
    }
  
    console.log('Comida encontrada:', mealToUpdate); // Depuración para ver la comida encontrada
  
    // Si la comida no tiene ID, primero la guardamos en el backend
    if (!mealToUpdate.id) {
      console.log('La comida no tiene ID, guardando en backend...');
      return this.postMealToBackend(mealToUpdate).pipe(
        switchMap((newMeal) => {
          console.log('Comida guardada en backend:', newMeal); // Depuración para ver la comida guardada en el backend
          mealToUpdate = newMeal;
          return this.updateMealWithFood(newMeal, typeMeal, foods);
        })
      );
    } else {
      console.log('Comida con ID encontrado, actualizando con alimentos...');
      return this.updateMealWithFood(mealToUpdate, typeMeal, foods);
    }
  }
  

  private updateMealWithFood(meal: Meal, typeMeal: string, foods: Food[]): Observable<Meal> {
    const updatedMeal: Meal = {
      ...meal,
      [typeMeal]: [
        ...(meal[typeMeal as keyof Meal] || []),
        { ...foods}
      ]
    };
  
    return this.http.put<Meal>(`${this.API_URL}/${meal.id}`, updatedMeal).pipe(
      map((updated) => {
        this.loadMeals(); // Recargar comidas localmente
        return updated;
      })
    );
  }
  

  // Eliminar un alimento de una comida
  removeFoodFromMeal(mealId: string, typeMeal: string, foodId: string): Observable<Meal> {
    // Obtenemos la comida correspondiente
    const currentMeals = this.mealsSubject.value;
    const mealToUpdate = currentMeals.find((meal) => meal.id === mealId);
  
    if (!mealToUpdate) {
      throw new Error('Meal not found');
    }
  
    // Obtenemos la lista actual de alimentos para el tipo de comida especificado
    const currentFoods = mealToUpdate[typeMeal as keyof Meal];
  
    if (!Array.isArray(currentFoods)) {
      throw new Error(`Invalid type for ${typeMeal}`);
    }
  
    // Creamos una copia de la comida actualizada sin el alimento
    const updatedMeal: Meal = {
      ...mealToUpdate,
      [typeMeal]: currentFoods.filter((food: Food) => food.id !== foodId),
    };
  
    // Realizamos la actualización en el backend
    return this.http.put<Meal>(`${this.API_URL}/${mealId}`, updatedMeal).pipe(
      map(() => {
        this.loadMeals(); // Actualizamos el estado local después de modificar
        return updatedMeal;
      })
    );
  }
  
  

  // Modificar la cantidad de gramos de un alimento en una comida
  modifyFoodInMeal(mealId: string, typeMeal: string, foodId: string, newGrams: number): Observable<Meal> {
    // Obtenemos la comida correspondiente
    const currentMeals = this.mealsSubject.value;
    const mealToUpdate = currentMeals.find((meal) => meal.id === mealId);
  
    if (!mealToUpdate) {
      throw new Error('Meal not found');
    }
  
    // Obtenemos la lista actual de alimentos para el tipo de comida especificado
    const currentFoods = mealToUpdate[typeMeal as keyof Meal];
  
    if (!Array.isArray(currentFoods)) {
      throw new Error(`Invalid type for ${typeMeal}`);
    }
  
    // Creamos una nueva lista de alimentos con la cantidad de gramos actualizada
    const updatedFoods = currentFoods.map((food: Food) => {
      if (food.id === foodId) {
        return {
          ...food,
          gramQuantity: newGrams, // Actualizamos los gramos del alimento
        };
      }
      return food;
    });
  
    // Creamos una copia de la comida actualizada
    const updatedMeal: Meal = {
      ...mealToUpdate,
      [typeMeal]: updatedFoods,
    };
  
    // Realizamos la actualización en el backend
    return this.http.put<Meal>(`${this.API_URL}/${mealId}`, updatedMeal).pipe(
      map(() => {
        this.loadMeals(); // Actualizamos el estado local después de modificar
        return updatedMeal;
      })
    );
  }
  

}
