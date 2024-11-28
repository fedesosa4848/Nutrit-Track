import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  constructor() {}

  getCurrentLocation(): Observable<{ latitude: number; longitude: number }> {
    return new Observable((observer) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            observer.complete(); // Termina el flujo.
          },
          (error) => {
            observer.error(`Error obteniendo ubicación: ${error.message}`);
          }
        );
      } else {
        observer.error('Geolocalización no es soportada por el navegador.');
      }
    });
  }
}
