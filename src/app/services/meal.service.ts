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
  addFoodToMeal(mealId: string, typeMeal: string, food: Food, grams: number): Observable<Meal> {
    // Obtenemos la comida correspondiente
    const currentMeals = this.mealsSubject.value;
    const mealToUpdate = currentMeals.find((meal) => meal.id === mealId);
  
    if (!mealToUpdate) {
      throw new Error('Meal not found');
    }
  
    // Creamos una copia de la comida actualizada
    const updatedMeal: Meal = {
      ...mealToUpdate,
      [typeMeal]: [
        ...(mealToUpdate[typeMeal as keyof Meal] || []),
        { ...food, gramQuantity: grams },
      ],
    };
  
    // Realizamos la actualización en el backend
    return this.http.put<Meal>(`${this.API_URL}/${mealId}`, updatedMeal).pipe(
      map(() => {
        this.loadMeals(); // Actualizamos el estado local después de modificar
        return updatedMeal;
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
  

  // Helper: Obtener la comida actualizada con el alimento agregado
  // private getUpdatedMeal(mealId: string, food: Food, grams: number): Meal {
  //   const meals = this.mealsSubject.getValue();
  //   const meal = meals.find(m => m.id === mealId);

  //   if (!meal) {
  //     throw new Error('Meal not found');
  //   }

  //   const newFood = {
  //     foodId: food.id,
  //     name: food.name,
  //     caloriesPerGram: food.caloriesPerGram,
  //     grams: grams,
  //   };

  //   meal.foods.push(newFood); // Agregamos el nuevo alimento a la comida
  //   return meal;
  // }

  // Helper: Eliminar un alimento de la comida
//   private removeFood(mealId: string, foodId: number): Meal {
//     const meals = this.mealsSubject.getValue();
//     const meal = meals.find(m => m.id === mealId);

//     if (!meal) {
//       throw new Error('Meal not found');
//     }

//     meal.foods = meal.foods.filter(food => food.foodId !== foodId); // Eliminamos el alimento
//     return meal;
//   }

//   // Helper: Modificar la cantidad de gramos de un alimento en la comida
//   private modifyFoodQuantity(mealId: number, foodId: number, newGrams: number): Meal {
//     const meals = this.mealsSubject.getValue();
//     const meal = meals.find(m => m.id === mealId);

//     if (!meal) {
//       throw new Error('Meal not found');
//     }

//     const foodToModify = meal.foods.find(food => food.foodId === foodId);

//     if (!foodToModify) {
//       throw new Error('Food not found');
//     }

//     foodToModify.grams = newGrams; // Modificamos los gramos del alimento
//     return meal;
//   }

//   // Exponer las comidas como un observable
//   getMeals(): Observable<Meal[]> {
//     return this.meals$;
//   }
// 
}
