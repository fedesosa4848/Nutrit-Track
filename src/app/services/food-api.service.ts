import { HttpClient , HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Food } from '../interfaces/food';
import { map } from 'rxjs';
import { transformFoodResponse } from '../utils/food.utils';
@Injectable({
  providedIn: 'root'
})
export class FoodApiService {

  constructor(private _httpService: HttpClient) { }

  private readonly API_URL = 'https://api.edamam.com/api/food-database/v2/parser';
  private readonly API_KEY = 'c9e56a3d6d963c9a4a06109f6a0f8822';
  private readonly APP_ID = '9ea988ad'; // Reemplaza con tu App ID


  searchFoodByName(query: string): Observable<Food[]> {
    const params = new HttpParams()
      .set('app_id', this.APP_ID)
      .set('app_key', this.API_KEY)
      .set('ingr', query);

    return this._httpService.get<any>(this.API_URL, { params }).pipe(
      map((response) => {
        const parsed = response.parsed || [];
        const hints = response.hints || [];
        const foods = [...parsed.map((item: any) => item.food), ...hints.map((item: any) => item.food)];
        return foods.map(transformFoodResponse);
      })
    );
  }

  searchFoodsByCalories(query: string, calorieRange: string, page: number = 1, pageSize: number = 10): Observable<Food[]> {
    let params = new HttpParams()
      .set('app_id', this.APP_ID)
      .set('app_key', this.API_KEY)
      .set('ingr', query) // Parámetro para el ingrediente o nombre del alimento
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('calories', calorieRange); // Establecemos el rango de calorías, ej. "500-900"
  
    return this._httpService.get<any>(this.API_URL, { params }).pipe(
      map((response) => {
        const parsed = response.parsed || [];
        const hints = response.hints || [];
        const foods = [...parsed.map((item: any) => item.food), ...hints.map((item: any) => item.food)];
        return foods.map(transformFoodResponse);
      })
    );
  }
  

  // Modificación de la función para aceptar un healthLabel
  searchFoodByHealthLabel(healthLabel: string = '', page: number = 1, pageSize: number = 10): Observable<Food[]> {
    let params = new HttpParams()
      .set('app_id', this.APP_ID)
      .set('app_key', this.API_KEY)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
  
    // Si hay un healthLabel, lo agregamos a los parámetros de la URL
    if (healthLabel) {
      params = params.set('health', healthLabel);  // Este parámetro se usa para filtrar por health label
    }
  
    return this._httpService.get<any>(this.API_URL, { params }).pipe(
      map((response) => {
        const parsed = response.parsed || [];
        const hints = response.hints || [];
        const foods = [...parsed.map((item: any) => item.food), ...hints.map((item: any) => item.food)];
        return foods.map(transformFoodResponse);
      })
    );
  }
  
  // Método para buscar alimentos por categoría (si es posible con la API)
  searchFoodByCategory(category: string): Observable<Food[]> {
    const params = new HttpParams()
      .set('app_id', this.APP_ID)
      .set('app_key', this.API_KEY)
      .set('category', category);

    return this._httpService.get<any>(this.API_URL, { params }).pipe(
      map((response) =>
        response.parsed.map((item: any) => transformFoodResponse(item.food))
      )
    );
  }
  
}
