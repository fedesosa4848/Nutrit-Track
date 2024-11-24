import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecetasService {

  private apiUrl = 'https://www.themealdb.com/api/json/v1/1/';

  constructor(private http: HttpClient) { }

  // Buscar recetas por nombre
  buscarPorNombre(nombre: string): Observable<any> {
    return this.http.get(`${this.apiUrl}search.php?s=${nombre}`);
  }

  // Buscar recetas por categoria
  buscarPorCategoria(categoria: string): Observable<any> {
    return this.http.get(`${this.apiUrl}filter.php?c=${categoria}`);
  }

  // Buscar recetas por ingrediente principal
  buscarPorIngrediente(ingrediente: string): Observable<any> {
    return this.http.get(`${this.apiUrl}filter.php?i=${ingrediente}`);
  }
}
