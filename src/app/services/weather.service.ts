import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = 'cIcZoSkqkBMPXNLbfy3wMqdurrgZ6S2A'; // Reemplaza con tu API key de AccuWeather
  private apiUrl = 'https://dataservice.accuweather.com';

  constructor(private http: HttpClient) {}

  // Obtener la Location Key basado en las coordenadas
  getLocationKey(lat: number, lon: number): Observable<any> {
    const url = `${this.apiUrl}/locations/v1/cities/geoposition/search?apikey=${this.apiKey}&q=${lat},${lon}`;
    return this.http.get(url);
  }

  // Obtener el clima basado en la Location Key
  getCurrentWeather(locationKey: string): Observable<any> {
    const url = `${this.apiUrl}/currentconditions/v1/${locationKey}?apikey=${this.apiKey}&language=en`;
    return this.http.get(url);  
  }
}
