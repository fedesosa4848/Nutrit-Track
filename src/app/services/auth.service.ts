import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interfaces/user';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/users'

  //Esta linea devuelve un valor verdadero o falso
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('userToken'));
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.http.get<User[]>(this.apiUrl).subscribe(users => {
        const user = users.find(u => u.profile.email === email && u.profile.password === password);

        if (user && user.id) {
          const currentDate = new Date().toISOString().split('T')[0]; // Formato: "YYYY-MM-DD"
          localStorage.setItem('loginDate', currentDate); // Guardamos la fecha en formato "YYYY-MM-DD"
          localStorage.setItem('userToken', user.id); // Guardamos el ID del usuario en el localStorage
          this.isAuthenticatedSubject.next(true); // Emitimos que el usuario está autenticado
          observer.next(true);
        } else {
          console.error(user ? 'Error: el ID del usuario no está definido' : 'Credenciales inválidas');
          observer.next(false);
        }
        observer.complete();
      });
    });
  }

  logout() {
    localStorage.removeItem('userToken');
    this.isAuthenticatedSubject.next(false); // Emitimos que el usuario no está autenticado
  }

  updateAuthState(isAuthenticated: boolean) {
    this.isAuthenticatedSubject.next(isAuthenticated); // Actualiza el estado de autenticación
  }
}
