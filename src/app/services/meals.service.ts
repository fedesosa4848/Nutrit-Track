import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { Meals } from '../interfaces/meals';
import { Food } from '../interfaces/food';

@Injectable({
  providedIn: 'root'
})
export class MealsService {

  private userToken?: string | null;
  private currentDate?: string | undefined | null;
  private baseUrl = 'http://localhost:3000/meals'; //URL BASE 

  constructor(private _httpService: HttpClient) {
    this.currentDate = new Date().toISOString().slice(0, 10);
    this.userToken = localStorage.getItem('userToken')
  }

  //Metodo que se ejecuta SIEMPRE que se inicia sesion para crear una MEAL con la fecha de hoy si es que no existe, caso contrario no hace nada
  loadMeals(userToken: string | null): Observable<Meals | null> {
    if (!userToken) {
      console.error('No hay un usuario autenticado');
      return of(null); // Retorna un observable vacío si no hay token de usuario
    }

    this.userToken = userToken;

    return this.getUserMealByDate(this.currentDate).pipe(
      switchMap(result => {
        console.log(result)
        if (result && result.length > 0) {
          // Si ya existe una comida para hoy, retornar la comida existente
          const existingMeal = result.find(meal => meal.date === this.currentDate);
          if (existingMeal) {
            return of(existingMeal); // Retorna la comida existente si ya tiene una comida con la misma fecha
          }
        }

        // Si no existe una comida para hoy, creamos una nueva
        const newMeal: Meals = {
          idUser: userToken,
          date: this.currentDate,
          breakfast: [],
          lunch: [],
          snack: [],
          dinner: [],
        };

        // Crear una nueva comida en el servidor (suponiendo que postMeal haga un POST)
        return this.postMeal(newMeal).pipe(
          map(() => newMeal) // Retorna la comida recién creada
        );
      }),
      catchError((error) => {
        console.error('Error al cargar las comidas', error);
        return of(null); // Retorna null en caso de error para evitar romper el flujo
      })
    );
  }

  //Retorna todos los meals del usuario con la sesion iniciada usando userToken
  getUserMeals(): Observable<Meals[]> {
    return this._httpService.get<Meals[]>(`${this.baseUrl}?idUser=${this.userToken}`); // URL de todas las meals de un usuario específico
  }

  //Retornar una meal de una fecha especifica del usuario con la sesion iniciada usando userToken
  getUserMealByDate(date: string | undefined | null): Observable<Meals[]> {
    return this._httpService.get<Meals[]>(`${this.baseUrl}?idUser=${this.userToken}&date=${date}`); //URL DE UNA MEAL ESPECIFICA DE UN USUARIO ESPECIFICO
  }

  //Agruega una meal al Json
  postMeal(meal: Meals): Observable<Meals> {
    return this._httpService.post<Meals>(this.baseUrl, meal);
  }


  //metodos para retornar-agregar-eliminar-editar una FOOD a un MEAL especifico

  //elimina una FOOD especifica de una MEAL especifica de una MEALTYPE especifica
  deleteFoodFromMeal(mealId: string | undefined, foodId: number | undefined, mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner' | undefined): Observable<Meals> {

    if (!mealId || foodId === undefined || !mealType) {
      return throwError('Faltan parámetros necesarios');
    }

    return this._httpService.get<Meals>(`${this.baseUrl}/${mealId}`).pipe(
      map((meal: Meals) => {
        // Filtrar el array de alimentos eliminando el alimento con el foodId especificado
        if (meal[mealType]) {
          meal[mealType] = meal[mealType].filter(food => food.id !== foodId);
        }
        return meal;
      }),
      // Enviar el objeto meal actualizado al servidor para persistir los cambios
      switchMap(updatedMeal => this._httpService.put<Meals>(`${this.baseUrl}/${mealId}`, updatedMeal))
    );
  }

  addFoodToMeal(
    mealId: number | undefined,
    food: Food | undefined,
    mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner' | undefined
  ): Observable<Meals> {
    // Validación de parámetros
    console.log(mealType, food);
    if (!mealId || !food || !mealType) {
      return throwError('Faltan parámetros necesarios');
    }

    return this._httpService.get<Meals>(`${this.baseUrl}/${mealId}`).pipe(
      map((meal: Meals) => {
        // Añadir el nuevo alimento al array correspondiente de la comida
        if (meal[mealType]) {
          meal[mealType].push(food);
        } else {
          meal[mealType] = [food]; // Crear el array si no existe
        }
        return meal;
      }),
      // Enviar el objeto meal actualizado al servidor para persistir los cambios
      switchMap(updatedMeal => this._httpService.put<Meals>(`${this.baseUrl}/${mealId}`, updatedMeal))
    );
  }

  updateFoodFromMeal(mealId: string | undefined, updatedFoodData: Food, mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner' | undefined): Observable<Meals> {

    if (!mealId || updatedFoodData.id === undefined || !mealType || !updatedFoodData) {
      return throwError('Faltan parámetros necesarios');
    }

    return this._httpService.get<Meals>(`${this.baseUrl}/${mealId}`).pipe(
      map((meal: Meals) => {
        // Buscar y actualizar el alimento en el array
        if (meal[mealType]) {
          meal[mealType] = meal[mealType].map(food =>
            food.id === updatedFoodData.id ? { ...food, ...updatedFoodData } : food
          );
        }
        return meal;
      }),
      // Enviar el objeto meal actualizado al servidor para persistir los cambios
      switchMap(updatedMeal => this._httpService.put<Meals>(`${this.baseUrl}/${mealId}`, updatedMeal))
    );
  }


}
